package store

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"strconv"
	"sync"
	"testing"
)

func undoRequest(snapshot Snapshot, operation string) CommitRequest {
	return CommitRequest{SchemaVersion: SchemaVersion, Epoch: snapshot.Epoch, AdventureID: snapshot.Adventure.ID, OperationID: operation, ExpectedVersion: snapshot.Adventure.Version, Kind: "undo_story_turn", TurnID: snapshot.Turns[len(snapshot.Turns)-1].ID}
}

func appendNext(t *testing.T, s *Store, snapshot Snapshot, suffix string) CommitRequest {
	t.Helper()
	req := storyRequest(snapshot.Epoch, snapshot.Adventure.ID, snapshot.Adventure.Version, suffix)
	req.Turn.Order = int64(len(snapshot.Turns)) + 1
	if _, err := s.Commit(context.Background(), req); err != nil {
		t.Fatal(err)
	}
	return req
}

func forkRequest(snapshot Snapshot, order int, id string) ForkRequest {
	return ForkRequest{SchemaVersion: SchemaVersion, Epoch: snapshot.Epoch, SourceAdventureID: snapshot.Adventure.ID, ExpectedVersion: snapshot.Adventure.Version, OperationID: "copy-" + id, AdventureID: id, TurnID: snapshot.Turns[order-1].ID, Title: "fork: " + snapshot.Adventure.Title}
}

func TestUndoPrefixContinuationReceiptsAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	first := appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	second := appendNext(t, s, readStory(t, s, library.Epoch, "story"), "second")
	before := readStory(t, s, library.Epoch, "story")
	fork := forkRequest(before, 2, "preserved-future")
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	draft := DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{DraftRequest: draft, Text: "Unfinished next input"}); err != nil {
		t.Fatal(err)
	}
	req := undoRequest(before, "undo-second")
	result, err := s.Commit(ctx, req)
	if err != nil || result.Version != 3 || result.TurnID != second.Turn.ID || result.Replayed {
		t.Fatalf("undo: %+v %v", result, err)
	}
	after := readStory(t, s, library.Epoch, "story")
	if after.Adventure.Version != 3 || !reflect.DeepEqual(after.Turns, []Turn{first.Turn}) || after.Baseline != before.Baseline {
		t.Fatalf("wrong surviving prefix: %+v", after)
	}
	var passages int
	if err := s.db.QueryRow(`SELECT count(*) FROM passages WHERE adventure_id='story'`).Scan(&passages); err != nil || passages != 2 {
		t.Fatalf("passage deletion: %d %v", passages, err)
	}
	if saved, err := s.ReadDraft(ctx, draft); err != nil || saved.Text != "Unfinished next input" {
		t.Fatalf("Undo changed draft: %+v %v", saved, err)
	}
	if preserved := readStory(t, s, library.Epoch, fork.AdventureID); !reflect.DeepEqual(preserved.Turns, before.Turns) {
		t.Fatal("Undo changed an independent Fork")
	}
	// Equal surviving turn count does not make an old expected version current.
	stale := storyRequest(library.Epoch, "story", 1, "stale-future")
	if _, err := s.Commit(ctx, stale); !errors.Is(err, ErrStaleVersion) {
		t.Fatalf("ABA submission accepted: %v", err)
	}
	forkAfterUndo := forkRequest(after, 1, "fork-after-undo")
	if _, err := s.Fork(ctx, forkAfterUndo); err != nil {
		t.Fatalf("Fork rejected version/count separation: %v", err)
	}
	replacement := appendNext(t, s, after, "different-second")
	want := readStory(t, s, library.Epoch, "story")
	if want.Adventure.Version != 4 || replacement.Turn.Order != 2 || want.Turns[1].ID == second.Turn.ID {
		t.Fatalf("new future: %+v", want)
	}
	if replay, err := s.Commit(ctx, req); err != nil || !replay.Replayed || replay.Version != 3 {
		t.Fatalf("original Undo receipt: %+v %v", replay, err)
	}
	if replay, err := s.Commit(ctx, second); err != nil || !replay.Replayed || replay.Version != 2 {
		t.Fatalf("removed append receipt: %+v %v", replay, err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("receipt replay removed replacement or resurrected old prose")
	}
	if other := readStory(t, s, library.Epoch, "other"); len(other.Turns) != 0 {
		t.Fatal("Undo crossed adventure ownership")
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, want) {
		t.Fatal("replacement prefix did not survive reopen")
	}
	if replay, err := reopened.Commit(ctx, req); err != nil || !replay.Replayed {
		t.Fatalf("Undo receipt did not survive reopen: %+v %v", replay, err)
	}
}

func TestUndoRepeatedToBaselineHasNoEditorDepthLimit(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	for i := 1; i <= 75; i++ {
		appendNext(t, s, readStory(t, s, library.Epoch, "story"), strconv.Itoa(i))
	}
	for i := 75; i >= 1; i-- {
		before := readStory(t, s, library.Epoch, "story")
		if _, err := s.Commit(ctx, undoRequest(before, "undo-"+strconv.Itoa(i))); err != nil {
			t.Fatal(err)
		}
		after := readStory(t, s, library.Epoch, "story")
		if len(after.Turns) != i-1 || after.Adventure.Version != before.Adventure.Version+1 || !reflect.DeepEqual(after.Turns, before.Turns[:i-1]) {
			t.Fatalf("rollback %d: %+v", i, after)
		}
	}
	baseline := readStory(t, s, library.Epoch, "story")
	if baseline.Adventure.Version != 150 || baseline.Baseline.SchemaVersion != 1 {
		t.Fatalf("baseline: %+v", baseline)
	}
	req := CommitRequest{SchemaVersion: SchemaVersion, Epoch: library.Epoch, AdventureID: "story", OperationID: "past-baseline", ExpectedVersion: 150, Kind: "undo_story_turn", TurnID: "turn-1"}
	if _, err := s.Commit(ctx, req); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("Undo before baseline: %v", err)
	}
	appendNext(t, s, baseline, "fresh-first")
	if current := readStory(t, s, library.Epoch, "story"); current.Adventure.Version != 151 || current.Turns[0].Order != 1 {
		t.Fatalf("continue from baseline: %+v", current)
	}
}

func TestUndoRejectsAndRollsBackWithoutPartialWrites(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	first := appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "second")
	before := readStory(t, s, library.Epoch, "story")
	req := undoRequest(before, "rollback")
	if _, err := s.commit(ctx, req, true); err == nil {
		t.Fatal("injected failure succeeded")
	}
	cases := []struct {
		name string
		edit func(*CommitRequest)
		want error
	}{
		{"old wire", func(r *CommitRequest) { r.SchemaVersion = 2 }, ErrInvalidRequest},
		{"epoch", func(r *CommitRequest) { r.Epoch = "wrong" }, ErrWrongEpoch},
		{"stale", func(r *CommitRequest) { r.ExpectedVersion-- }, ErrStaleVersion},
		{"earlier target", func(r *CommitRequest) { r.TurnID = first.Turn.ID }, ErrInvalidRequest},
		{"missing target", func(r *CommitRequest) { r.TurnID = "" }, ErrInvalidRequest},
		{"unexpected body", func(r *CommitRequest) { r.Turn = first.Turn }, ErrInvalidRequest},
		{"creation identity", func(r *CommitRequest) { r.OperationID = "create-story" }, ErrOperationID},
		{"append identity", func(r *CommitRequest) { r.OperationID = first.OperationID }, ErrOperationID},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := undoRequest(before, "reject")
			tc.edit(&r)
			if _, err := s.Commit(ctx, r); !errors.Is(err, tc.want) {
				t.Fatalf("got %v; want %v", err, tc.want)
			}
		})
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("rejection or transaction rollback changed canon")
	}
	var operations int
	if err := s.db.QueryRow(`SELECT count(*) FROM operations`).Scan(&operations); err != nil || operations != 4 {
		t.Fatalf("rejection leaked receipts: %d %v", operations, err)
	}
	if _, err := s.Commit(ctx, req); err != nil {
		t.Fatalf("failed transaction consumed operation identity: %v", err)
	}
	changed := req
	changed.TurnID = first.Turn.ID
	if _, err := s.Commit(ctx, changed); !errors.Is(err, ErrOperationID) {
		t.Fatalf("changed Undo reused receipt: %v", err)
	}
	if _, err := s.db.Exec(`UPDATE library_meta SET epoch='replacement'`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Commit(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("old Undo receipt bypassed epoch: %v", err)
	}
}

func TestUndoFailsClosedForUnsupportedEffectsAndRacesWithAppend(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	appendNext(t, s, readStory(t, s, library.Epoch, "story"), "first")
	before := readStory(t, s, library.Epoch, "story")
	undo := undoRequest(before, "race-undo")
	appendReq := storyRequest(library.Epoch, "story", 1, "race-append")
	var group sync.WaitGroup
	results := make(chan error, 2)
	for _, req := range []CommitRequest{undo, appendReq} {
		group.Go(func() { _, err := s.Commit(ctx, req); results <- err })
	}
	group.Wait()
	close(results)
	successes, stale := 0, 0
	for err := range results {
		if err == nil {
			successes++
		} else if errors.Is(err, ErrStaleVersion) {
			stale++
		} else {
			t.Fatal(err)
		}
	}
	if successes != 1 || stale != 1 {
		t.Fatalf("race: success=%d stale=%d", successes, stale)
	}
	current := readStory(t, s, library.Epoch, "story")
	if len(current.Turns) == 0 {
		appendNext(t, s, current, "unsupported")
	}
	if _, err := s.db.Exec(`UPDATE turns SET events='[{"type":"unsupported_core"}]' WHERE adventure_id='story'`); err != nil {
		t.Fatal(err)
	}
	unsupported := readStory(t, s, library.Epoch, "story")
	if _, err := s.Commit(ctx, undoRequest(unsupported, "unsupported-undo")); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatalf("unsupported Undo: %v", err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, unsupported) {
		t.Fatal("unsupported history changed")
	}
}

func TestUndoWireShapeAndV3UpgradePreserveExistingData(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	appendReq := appendNext(t, s, readStory(t, s, library.Epoch, "story"), "upgrade")
	before := readStory(t, s, library.Epoch, "story")
	req := undoRequest(before, "shape")
	encoded, err := json.Marshal(req)
	if err != nil {
		t.Fatal(err)
	}
	var decoded CommitRequest
	if err := json.Unmarshal(encoded, &decoded); err != nil || !reflect.DeepEqual(req, decoded) {
		t.Fatalf("Undo wire roundtrip: %s %v", encoded, err)
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &fields); err != nil {
		t.Fatal(err)
	}
	fields["turn"] = json.RawMessage(`{}`)
	ambiguous, _ := json.Marshal(fields)
	if err := json.Unmarshal(ambiguous, &decoded); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("ambiguous shape accepted: %v", err)
	}
	if _, err := s.SaveDraft(ctx, SaveDraftRequest{DraftRequest: DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}, Text: "Retain this draft"}); err != nil {
		t.Fatal(err)
	}
	if _, err := s.db.Exec(`DROP TABLE model_settings; DROP TABLE model_profiles; PRAGMA user_version=3`); err != nil {
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
		t.Fatalf("version fence: %d %v", version, err)
	}
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("nonspatial version fence altered history")
	}
	if result, err := reopened.Commit(ctx, appendReq); err != nil || !result.Replayed {
		t.Fatalf("upgrade altered receipt: %+v %v", result, err)
	}
	if draft, err := reopened.ReadDraft(ctx, DraftRequest{SchemaVersion, library.Epoch, "story", "composer_story"}); err != nil || draft.Text != "Retain this draft" {
		t.Fatalf("upgrade altered draft: %+v %v", draft, err)
	}
	old := appendReq
	old.SchemaVersion = 2
	if _, err := reopened.Commit(ctx, old); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("old tab accepted: %v", err)
	}
	// Later upgrades add only noncanonical model settings, no archive or spatial table.
	var tables int
	if err := reopened.db.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`).Scan(&tables); err != nil || tables != 8 {
		t.Fatalf("unexpected tables: %d %v", tables, err)
	}
}
