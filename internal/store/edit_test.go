package store

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"sync"
	"testing"
)

func editRequest(snapshot Snapshot, order int, operation, later string) CommitRequest {
	target := snapshot.Turns[order-1]
	body := target.Passages[1].Body
	body.Content = []Paragraph{{Type: "paragraph", Content: []Inline{{Type: "text", Text: "A revised passage. 🦉"}}}, {Type: "paragraph", Content: []Inline{{Type: "text", Text: "Another paragraph."}}}}
	return CommitRequest{SchemaVersion: SchemaVersion, Epoch: snapshot.Epoch, AdventureID: snapshot.Adventure.ID, OperationID: operation, ExpectedVersion: snapshot.Adventure.Version, Kind: "edit_generated_passage", TurnID: target.ID, PassageID: target.Passages[1].ID, Body: &body, Later: later}
}

func TestEditKeepTruncateDraftsForkRecoveryAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	for _, suffix := range []string{"first", "second", "third"} {
		appendNext(t, s, readStory(t, s, library.Epoch, "story"), suffix)
	}
	before := readStory(t, s, library.Epoch, "story")
	if _, err := s.Fork(ctx, forkRequest(before, 3, "original")); err != nil {
		t.Fatal(err)
	}
	keep := editRequest(before, 1, "keep", "keep")
	target := DraftRequest{SchemaVersion, library.Epoch, "story", "passage:" + keep.PassageID}
	composer := DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}
	later := DraftRequest{SchemaVersion, library.Epoch, "story", "passage:" + before.Turns[2].Passages[1].ID}
	for _, draft := range []SaveDraftRequest{{target, documentText(*keep.Body)}, {composer, "unfinished composer"}, {later, "later draft"}} {
		if _, err := s.SaveDraft(ctx, draft); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := s.Commit(ctx, keep); err != nil {
		t.Fatal(err)
	}
	after := readStory(t, s, library.Epoch, "story")
	expected := before
	expected.Adventure.Version++
	expected.Turns = append([]Turn(nil), before.Turns...)
	expected.Turns[0].Passages = append([]Passage(nil), before.Turns[0].Passages...)
	expected.Turns[0].Passages[1].Body = *keep.Body
	if !reflect.DeepEqual(after, expected) {
		t.Fatal("Keep changed unrelated history or identity")
	}
	if draft, err := s.ReadDraft(ctx, target); err != nil || *draft.Exists {
		t.Fatalf("matching draft not consumed: %+v %v", draft, err)
	}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{target, "another tab's newer draft"}); err != nil {
		t.Fatal(err)
	}
	truncate := editRequest(after, 1, "truncate", "truncate")
	if _, err := s.Commit(ctx, truncate); err != nil {
		t.Fatal(err)
	}
	current := readStory(t, s, library.Epoch, "story")
	if len(current.Turns) != 1 || current.Adventure.Version != 5 || !reflect.DeepEqual(current.Turns[0], expected.Turns[0]) || current.Baseline != before.Baseline {
		t.Fatal("wrong truncation boundary")
	}
	for _, check := range []struct {
		request DraftRequest
		text    string
	}{{target, "another tab's newer draft"}, {composer, "unfinished composer"}} {
		draft, err := s.ReadDraft(ctx, check.request)
		if err != nil || draft.Text != check.text {
			t.Fatalf("unrelated draft changed: %+v %v", draft, err)
		}
	}
	var removedDrafts int
	if err := s.db.QueryRow(`SELECT count(*) FROM drafts WHERE target=?`, later.Target).Scan(&removedDrafts); err != nil || removedDrafts != 0 {
		t.Fatal("removed target draft survived truncation")
	}
	if original := readStory(t, s, library.Epoch, "original"); !reflect.DeepEqual(original.Turns, before.Turns) {
		t.Fatal("edit changed independent Fork")
	}
	appendNext(t, s, current, "replacement")
	want := readStory(t, s, library.Epoch, "story")
	for _, req := range []CommitRequest{keep, truncate} {
		if result, err := s.Commit(ctx, req); err != nil || !result.Replayed {
			t.Fatalf("recovery: %+v %v", result, err)
		}
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("receipt rewrote new history")
	}
	if _, err := s.Fork(ctx, forkRequest(want, 2, "edited-fork")); err != nil {
		t.Fatal(err)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("edit/replacement did not survive reopen")
	}
	if result, err := reopened.Commit(ctx, truncate); err != nil || !result.Replayed {
		t.Fatalf("reopened receipt: %+v %v", result, err)
	}
	if _, err := reopened.Commit(ctx, undoRequest(want, "undo-replacement")); err != nil {
		t.Fatal(err)
	}
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got.Turns, current.Turns) {
		t.Fatal("Undo lost edited prefix")
	}
}

func TestEditRejectsAtomicFailureMalformedStaleEpochAndUnsupported(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "second")
	before := readStory(t, s, library.Epoch, "story")
	req := editRequest(before, 1, "edit", "truncate")
	if _, err := s.commit(ctx, req, true); err == nil {
		t.Fatal("injected failure succeeded")
	}
	cases := []struct {
		name   string
		change func(*CommitRequest)
		want   error
	}{
		{"stale", func(r *CommitRequest) { r.ExpectedVersion-- }, ErrStaleVersion},
		{"epoch", func(r *CommitRequest) { r.Epoch = "other" }, ErrWrongEpoch},
		{"authored", func(r *CommitRequest) { r.PassageID = before.Turns[0].Passages[0].ID }, ErrInvalidRequest},
		{"wrong turn", func(r *CommitRequest) { r.TurnID = before.Turns[1].ID }, ErrInvalidRequest},
		{"wrong adventure", func(r *CommitRequest) { r.AdventureID = "other"; r.ExpectedVersion = 0 }, ErrInvalidRequest},
		{"no choice", func(r *CommitRequest) { r.Later = "" }, ErrInvalidRequest},
		{"body absent", func(r *CommitRequest) { r.Body = nil }, ErrInvalidRequest},
		{"ambiguous turn", func(r *CommitRequest) { r.Turn = before.Turns[0] }, ErrInvalidRequest},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := req
			tc.change(&r)
			if _, err := s.Commit(ctx, r); !errors.Is(err, tc.want) {
				t.Fatalf("got %v want %v", err, tc.want)
			}
		})
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("failure changed canon")
	}
	encoded, _ := json.Marshal(req)
	var decoded CommitRequest
	if err := json.Unmarshal(encoded, &decoded); err != nil || !reflect.DeepEqual(req, decoded) {
		t.Fatalf("wire roundtrip: %s %v", encoded, err)
	}
	var fields map[string]json.RawMessage
	json.Unmarshal(encoded, &fields)
	for _, field := range []string{"body", "later", "passageId", "expectedVersion"} {
		original := fields[field]
		delete(fields, field)
		bad, _ := json.Marshal(fields)
		if err := json.Unmarshal(bad, &decoded); !errors.Is(err, ErrInvalidRequest) {
			t.Fatalf("missing %s accepted", field)
		}
		fields[field] = original
	}
	if _, err := s.Commit(ctx, req); err != nil {
		t.Fatal(err)
	}
	changed := req
	changed.Later = "keep"
	if _, err := s.Commit(ctx, changed); !errors.Is(err, ErrOperationID) {
		t.Fatal("changed payload reused receipt")
	}
	if _, err := s.db.Exec(`UPDATE turns SET events='[{"type":"unknown"}]' WHERE adventure_id='story'`); err != nil {
		t.Fatal(err)
	}
	unsupported := readStory(t, s, library.Epoch, "story")
	if _, err := s.Commit(ctx, editRequest(unsupported, 1, "unsupported", "keep")); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatal("unsupported effects accepted")
	}
	if _, err := s.db.Exec(`UPDATE library_meta SET epoch='new-epoch'`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Commit(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatal("receipt bypassed epoch")
	}
}

func TestEditRacesWithAppend(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	before := readStory(t, s, library.Epoch, "story")
	results := make(chan error, 2)
	var group sync.WaitGroup
	for _, req := range []CommitRequest{editRequest(before, 1, "race-edit", "truncate"), storyRequest(library.Epoch, "story", 1, "race-append")} {
		group.Go(func() { _, err := s.Commit(ctx, req); results <- err })
	}
	group.Wait()
	close(results)
	success, stale := 0, 0
	for err := range results {
		if err == nil {
			success++
		} else if errors.Is(err, ErrStaleVersion) {
			stale++
		} else {
			t.Fatal(err)
		}
	}
	if success != 1 || stale != 1 {
		t.Fatalf("race: %d successes, %d stale", success, stale)
	}
}

func TestPassageDraftTargetsEmptyDiscardAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	snapshot := readStory(t, s, library.Epoch, "story")
	target := DraftRequest{SchemaVersion, library.Epoch, "story", "passage:" + snapshot.Turns[0].Passages[1].ID}
	if draft, err := s.ReadDraft(ctx, target); err != nil || draft.Exists == nil || *draft.Exists {
		t.Fatalf("missing draft: %+v %v", draft, err)
	}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{target, ""}); err != nil {
		t.Fatal(err)
	}
	if draft, err := s.ReadDraft(ctx, target); err != nil || !*draft.Exists || draft.Text != "" {
		t.Fatal("empty draft is not distinct from absence")
	}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{target, "newer"}); err != nil {
		t.Fatal(err)
	}
	if err := s.DeleteDraft(ctx, SaveDraftRequest{target, "older"}); err != nil {
		t.Fatal(err)
	}
	if draft, err := s.ReadDraft(ctx, target); err != nil || draft.Text != "newer" {
		t.Fatal("discard erased different shared value")
	}
	for _, id := range []string{snapshot.Turns[0].Passages[0].ID, "absent"} {
		bad := target
		bad.Target = "passage:" + id
		if _, err := s.SaveDraft(ctx, SaveDraftRequest{bad, "bad"}); !errors.Is(err, ErrNotFound) {
			t.Fatal("invalid target saved")
		}
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if draft, err := reopened.ReadDraft(ctx, target); err != nil || draft.Text != "newer" {
		t.Fatal("draft did not survive reopen")
	}
	if err := reopened.DeleteDraft(ctx, SaveDraftRequest{target, "newer"}); err != nil {
		t.Fatal(err)
	}
	if draft, err := reopened.ReadDraft(ctx, target); err != nil || *draft.Exists {
		t.Fatal("discard failed")
	}
}
