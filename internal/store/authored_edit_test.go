package store

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
)

func authoredEditRequest(snapshot Snapshot, order int, operation, later string) CommitRequest {
	target := snapshot.Turns[order-1]
	body := target.Passages[0].Body
	body.Content = []Paragraph{{Type: "paragraph", Content: []Inline{{Type: "text", Text: "A revised passage. 🦉"}}}, {Type: "paragraph", Content: []Inline{{Type: "text", Text: "Another paragraph."}}}}
	return CommitRequest{SchemaVersion: SchemaVersion, Epoch: snapshot.Epoch, AdventureID: snapshot.Adventure.ID, OperationID: operation, ExpectedVersion: snapshot.Adventure.Version, Kind: "edit_authored_passage", TurnID: target.ID, PassageID: target.Passages[0].ID, Body: &body, Later: later}
}

func TestAuthoredEditExactBoundaryDraftsRecoveryForkUndoAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	for _, suffix := range []string{"first", "second", "third"} {
		appendNext(t, s, readStory(t, s, library.Epoch, "story"), suffix)
	}
	before := readStory(t, s, library.Epoch, "story")
	if _, err := s.Fork(ctx, forkRequest(before, 3, "original")); err != nil {
		t.Fatal(err)
	}
	keep := authoredEditRequest(before, 2, "authored-keep", "keep")
	target := DraftRequest{SchemaVersion, library.Epoch, "story", "passage:" + keep.PassageID}
	continuation := DraftRequest{SchemaVersion, library.Epoch, "story", "passage:" + before.Turns[1].Passages[1].ID}
	composer := DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}
	for _, draft := range []SaveDraftRequest{{target, documentText(*keep.Body)}, {continuation, "separate continuation draft"}, {composer, "unfinished composer"}} {
		if _, err := s.SaveDraft(ctx, draft); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := s.Commit(ctx, keep); err != nil {
		t.Fatal(err)
	}
	kept := readStory(t, s, library.Epoch, "story")
	expected := before
	expected.Adventure.Version++
	expected.Turns = append([]Turn(nil), before.Turns...)
	expected.Turns[1].Passages = append([]Passage(nil), before.Turns[1].Passages...)
	expected.Turns[1].Passages[0].Body = *keep.Body
	if !reflect.DeepEqual(kept, expected) {
		t.Fatal("authored Keep changed identity, continuation or later history")
	}
	if draft, err := s.ReadDraft(ctx, target); err != nil || *draft.Exists {
		t.Fatal("matching authored draft was not consumed")
	}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{target, "newer shared authored draft"}); err != nil {
		t.Fatal(err)
	}
	truncate := authoredEditRequest(kept, 2, "authored-truncate", "truncate")
	if _, err := s.commit(ctx, truncate, true); err == nil {
		t.Fatal("injected failure succeeded")
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, kept) {
		t.Fatal("failed truncation changed history")
	}
	if draft, err := s.ReadDraft(ctx, continuation); err != nil || draft.Text != "separate continuation draft" {
		t.Fatal("failed truncation removed a draft")
	}
	if _, err := s.Commit(ctx, truncate); err != nil {
		t.Fatal(err)
	}
	truncated := readStory(t, s, library.Epoch, "story")
	expected.Adventure.Version++
	expected.Turns = expected.Turns[:2]
	expected.Turns[1].Passages = expected.Turns[1].Passages[:1]
	if !reflect.DeepEqual(truncated, expected) {
		t.Fatal("authored boundary must remove same-turn continuation and every later passage")
	}
	if _, err := s.ReadDraft(ctx, continuation); !errors.Is(err, ErrNotFound) {
		t.Fatal("removed continuation remains a draft target")
	}
	var orphanDrafts int
	if err := s.db.QueryRow(`SELECT count(*) FROM drafts WHERE target=?`, continuation.Target).Scan(&orphanDrafts); err != nil || orphanDrafts != 0 {
		t.Fatal("removed continuation draft survived")
	}
	for _, check := range []SaveDraftRequest{{target, "newer shared authored draft"}, {composer, "unfinished composer"}} {
		if draft, err := s.ReadDraft(ctx, check.DraftRequest); err != nil || draft.Text != check.Text {
			t.Fatal("unrelated latest draft changed")
		}
	}
	if original := readStory(t, s, library.Epoch, "original"); !reflect.DeepEqual(original.Turns, before.Turns) {
		t.Fatal("source edit changed independent Fork")
	}
	if _, err := s.Fork(ctx, forkRequest(truncated, 2, "authored-only-fork")); err != nil {
		t.Fatal(err)
	}
	if fork := readStory(t, s, library.Epoch, "authored-only-fork"); !reflect.DeepEqual(fork.Turns, truncated.Turns) {
		t.Fatal("Fork lost authored-only boundary")
	}
	appendNext(t, s, truncated, "new-future")
	want := readStory(t, s, library.Epoch, "story")
	for _, req := range []CommitRequest{keep, truncate} {
		if result, err := s.Commit(ctx, req); err != nil || !result.Replayed {
			t.Fatalf("original edit recovery: %+v %v", result, err)
		}
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("receipt repeated old truncation over new continuation")
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("authored boundary and new continuation did not survive reopen")
	}
	if result, err := reopened.Commit(ctx, truncate); err != nil || !result.Replayed {
		t.Fatal("reopen lost edit receipt")
	}
	for _, snapshot := range []Snapshot{want, truncated} {
		current := readStory(t, reopened, library.Epoch, "story")
		if _, err := reopened.Commit(ctx, undoRequest(current, "undo-"+snapshot.Turns[len(snapshot.Turns)-1].ID)); err != nil {
			t.Fatal(err)
		}
	}
	if got := readStory(t, reopened, library.Epoch, "story"); len(got.Turns) != 1 || !reflect.DeepEqual(got.Turns[0], before.Turns[0]) {
		t.Fatal("Undo did not remove the complete authored-only turn")
	}
}

func TestAuthoredEditRejectsWrongTargetsStaleEpochAndPartialAppend(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	before := readStory(t, s, library.Epoch, "story")
	req := authoredEditRequest(before, 1, "authored-edit", "truncate")
	encoded, _ := json.Marshal(req)
	var decoded CommitRequest
	if err := json.Unmarshal(encoded, &decoded); err != nil || !reflect.DeepEqual(req, decoded) {
		t.Fatal("authored edit wire roundtrip failed", err)
	}
	for _, tc := range []struct {
		name   string
		change func(*CommitRequest)
		want   error
	}{
		{"generated target", func(r *CommitRequest) { r.PassageID = before.Turns[0].Passages[1].ID }, ErrInvalidRequest},
		{"wrong turn", func(r *CommitRequest) { r.TurnID = "missing" }, ErrInvalidRequest},
		{"stale", func(r *CommitRequest) { r.ExpectedVersion-- }, ErrStaleVersion},
		{"epoch", func(r *CommitRequest) { r.Epoch = "other" }, ErrWrongEpoch},
		{"old wire", func(r *CommitRequest) { r.SchemaVersion = 3 }, ErrInvalidRequest},
	} {
		t.Run(tc.name, func(t *testing.T) {
			changed := req
			tc.change(&changed)
			if _, err := s.Commit(ctx, changed); !errors.Is(err, tc.want) {
				t.Fatalf("got %v want %v", err, tc.want)
			}
		})
	}
	partial := storyRequest(library.Epoch, "story", 1, "partial")
	partial.Turn.Passages = partial.Turn.Passages[:1]
	if _, err := s.Commit(ctx, partial); !errors.Is(err, ErrInvalidRequest) {
		t.Fatal("new turn append accepted without its generated proposal")
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("rejection mutated canon")
	}
	if _, err := s.Commit(ctx, req); err != nil {
		t.Fatal(err)
	}
	current := readStory(t, s, library.Epoch, "story")
	if _, err := s.Commit(ctx, authoredEditRequest(current, 1, "edit-again", "keep")); err != nil {
		t.Fatal("authored-only turn cannot be edited again", err)
	}
	if _, err := s.Commit(ctx, req); err != nil {
		t.Fatal("receipt recovery failed", err)
	}
	if _, err := s.db.Exec(`UPDATE turns SET events='[{"type":"unknown"}]' WHERE adventure_id='story'`); err != nil {
		t.Fatal(err)
	}
	unsupported := readStory(t, s, library.Epoch, "story")
	if _, err := s.Commit(ctx, authoredEditRequest(unsupported, 1, "unsupported", "keep")); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatal("authored edit bypassed unsupported-event protection")
	}
}

func TestUpgradeV4PreservesHistoryDraftsEpochAndReceipts(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	before := readStory(t, s, library.Epoch, "story")
	target := DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{target, "preserved draft"}); err != nil {
		t.Fatal(err)
	}
	var receipts string
	if err := s.db.QueryRow(`SELECT json_group_array(json_object('id',operation_id,'hash',request_hash,'result',result)) FROM operations ORDER BY operation_id`).Scan(&receipts); err != nil {
		t.Fatal(err)
	}
	if _, err := s.db.Exec(`DROP TABLE model_settings; DROP TABLE model_profiles; PRAGMA user_version=4`); err != nil {
		t.Fatal(err)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	var version int
	if err := reopened.db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != databaseVersion {
		t.Fatal("old binary fence was not upgraded")
	}
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("metadata upgrade changed accepted history or epoch")
	}
	if draft, err := reopened.ReadDraft(ctx, target); err != nil || draft.Text != "preserved draft" {
		t.Fatal("metadata upgrade changed draft")
	}
	var afterReceipts string
	if err := reopened.db.QueryRow(`SELECT json_group_array(json_object('id',operation_id,'hash',request_hash,'result',result)) FROM operations ORDER BY operation_id`).Scan(&afterReceipts); err != nil || afterReceipts != receipts {
		t.Fatal("metadata upgrade changed original receipt rows")
	}
	if _, err := reopened.Read(ctx, ReadRequest{3, library.Epoch, "story"}); !errors.Is(err, ErrInvalidRequest) {
		t.Fatal("old browser wire was not fenced")
	}
	if _, err := reopened.Commit(ctx, authoredEditRequest(before, 1, "after-upgrade", "truncate")); err != nil {
		t.Fatal("upgraded library cannot edit authored history", err)
	}
}

func TestAuthoredTruncationRejectsMisplacedStoredPassage(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	before := readStory(t, s, library.Epoch, "story")
	req := authoredEditRequest(before, 1, "malformed-position", "truncate")
	if _, err := s.db.Exec(`DELETE FROM passages WHERE adventure_id='story' AND source='generated'; UPDATE passages SET ordinal=1 WHERE adventure_id='story'`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Read(ctx, ReadRequest{SchemaVersion, library.Epoch, "story"}); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatal("misplaced authored row was read as a valid boundary")
	}
	if _, err := s.Commit(ctx, req); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatal("misplaced authored target was mutated", err)
	}
	var version int64
	var passages, receipts int
	if err := s.db.QueryRow(`SELECT version FROM adventures WHERE id='story'`).Scan(&version); err != nil || version != before.Adventure.Version {
		t.Fatal("malformed history changed version")
	}
	if err := s.db.QueryRow(`SELECT count(*) FROM passages WHERE adventure_id='story' AND id=? AND ordinal=1`, req.PassageID).Scan(&passages); err != nil || passages != 1 {
		t.Fatal("malformed history lost its authored passage")
	}
	if err := s.db.QueryRow(`SELECT count(*) FROM operations WHERE operation_id=?`, storyReceiptKey("story", req.OperationID)).Scan(&receipts); err != nil || receipts != 0 {
		t.Fatal("rejected malformed history created a receipt")
	}
}
