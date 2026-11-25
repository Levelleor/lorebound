package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"reflect"
	"strings"
	"testing"
)

func authorNotesRequest(epoch, id, notes string) SaveAuthorNotesRequest {
	return SaveAuthorNotesRequest{ReadRequest: ReadRequest{SchemaVersion, epoch, id}, Notes: notes}
}

func TestAuthorNotesIsolationConflictsAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	commit := storyRequest(library.Epoch, "story", 0, "first")
	if _, err := s.Commit(ctx, commit); err != nil {
		t.Fatal(err)
	}
	before := readStory(t, s, library.Epoch, "story")
	draft := draftRequest(library.Epoch, "story", "Unsent prose")
	if _, err := s.SaveDraft(ctx, draft); err != nil {
		t.Fatal(err)
	}
	req := authorNotesRequest(library.Epoch, "story", "Keep the sea unsettled.\nDo not name the watcher yet. 🦉")
	empty, err := s.ReadAuthorNotes(ctx, req.ReadRequest)
	if err != nil || empty.Revision != 0 || empty.Notes != "" {
		t.Fatal(empty, err)
	}
	var rows int
	if err := s.db.QueryRow(`SELECT count(*) FROM author_notes`).Scan(&rows); err != nil || rows != 0 {
		t.Fatal("reading empty notes wrote a row", rows, err)
	}
	saved, err := s.SaveAuthorNotes(ctx, req)
	if err != nil || saved.Revision != 1 || saved.Notes != req.Notes {
		t.Fatal(saved, err)
	}
	replayed, err := s.SaveAuthorNotes(ctx, req)
	if err != nil || replayed != saved {
		t.Fatal("uncertain save retry", replayed, err)
	}
	req.Notes = "An obsolete tab"
	if _, err := s.SaveAuthorNotes(ctx, req); !errors.Is(err, ErrAuthorNotesChanged) {
		t.Fatal("stale save accepted", err)
	}
	req.Epoch = "wrong"
	if _, err := s.SaveAuthorNotes(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatal("wrong epoch accepted", err)
	}
	req.Epoch = library.Epoch
	req.AdventureID = "missing"
	if _, err := s.SaveAuthorNotes(ctx, req); !errors.Is(err, ErrNotFound) {
		t.Fatal("missing adventure accepted", err)
	}
	if _, err := s.ReadAuthorNotes(ctx, ReadRequest{SchemaVersion, library.Epoch, "missing"}); !errors.Is(err, ErrNotFound) {
		t.Fatal("missing adventure read accepted", err)
	}
	other, err := s.ReadAuthorNotes(ctx, ReadRequest{SchemaVersion, library.Epoch, "other"})
	if err != nil || other.Notes != "" || other.Revision != 0 {
		t.Fatal("adventure notes leaked", other, err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("notes changed canon")
	}
	if got, err := s.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
		t.Fatal("notes changed composer draft", err)
	}
	update := authorNotesRequest(library.Epoch, "story", "A fresh direction for the next attempt.")
	update.ExpectedRevision = 1
	second, err := s.SaveAuthorNotes(ctx, update)
	if err != nil || second.Revision != 2 || second.Notes != update.Notes {
		t.Fatal("revision did not advance monotonically", second, err)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	got, err := reopened.ReadAuthorNotes(ctx, second.ReadRequest)
	if err != nil || got != second {
		t.Fatal("notes lost on reopen", got, err)
	}
	if got, err := reopened.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
		t.Fatal("notes changed draft", err)
	}
	if replayed, err := reopened.Commit(ctx, commit); err != nil || !replayed.Replayed {
		t.Fatal("notes changed receipt", err)
	}
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("notes changed canon after reopen")
	}
}

func TestAuthorNotesStrictValidationAndRollback(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	for _, change := range []func(*SaveAuthorNotesRequest){
		func(r *SaveAuthorNotesRequest) { r.SchemaVersion = 0 },
		func(r *SaveAuthorNotesRequest) { r.ExpectedRevision = -1 },
		func(r *SaveAuthorNotesRequest) { r.ExpectedRevision = 9007199254740991 },
		func(r *SaveAuthorNotesRequest) { r.Notes = string([]byte{0xff}) },
		func(r *SaveAuthorNotesRequest) { r.Notes = "Valid" + string([]byte{0xc3}) },
		func(r *SaveAuthorNotesRequest) { r.Notes = strings.Repeat("x", 4001) },
		func(r *SaveAuthorNotesRequest) { r.Notes = strings.Repeat("🦉", 4001) },
	} {
		req := authorNotesRequest(library.Epoch, "story", "Valid note")
		change(&req)
		if _, err := s.SaveAuthorNotes(ctx, req); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid notes accepted", err)
		}
	}
	limit := authorNotesRequest(library.Epoch, "story", strings.Repeat("🦉", 4000))
	accepted, err := s.SaveAuthorNotes(ctx, limit)
	if err != nil || accepted.Revision != 1 || accepted.Notes != limit.Notes {
		t.Fatal("4000 code points rejected", err)
	}
	valid, err := json.Marshal(authorNotesRequest(library.Epoch, "story", "A direction."))
	if err != nil {
		t.Fatal(err)
	}
	for _, data := range []string{
		strings.Replace(string(valid), `"expectedRevision":0,`, "", 1),
		strings.Replace(string(valid), `"expectedRevision":0`, `"expectedRevision":null`, 1),
		strings.Replace(string(valid), `"notes":"A direction."`, `"notes":null`, 1),
		strings.Replace(string(valid), `"notes":"A direction."`, `"notes":5`, 1),
		strings.Replace(string(valid), `"notes":"A direction."`, `"notes":["A direction."]`, 1),
		strings.Replace(string(valid), `"notes":"A direction."`, `"notes":{"text":"A direction."}`, 1),
		strings.Replace(string(valid), `"schemaVersion":4,`, `"schemaVersion":4,"apiKey":"unexpected",`, 1),
	} {
		var decoded SaveAuthorNotesRequest
		if err := json.Unmarshal([]byte(data), &decoded); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid wire notes accepted", data, err)
		}
	}
	if _, err := s.db.Exec(`CREATE TRIGGER fail_author_notes BEFORE INSERT ON author_notes BEGIN SELECT RAISE(ABORT,'injected_failure'); END;`); err != nil {
		t.Fatal(err)
	}
	failed := authorNotesRequest(library.Epoch, "story", "A failed direction.")
	failed.ExpectedRevision = 1
	if _, err := s.SaveAuthorNotes(ctx, failed); err == nil {
		t.Fatal("injected failure accepted")
	}
	got, err := s.ReadAuthorNotes(ctx, failed.ReadRequest)
	if err != nil || got.Revision != 1 || got.Notes != limit.Notes {
		t.Fatal("failed save changed notes", got, err)
	}
}

func TestAuthorNotesUpgradeAndRollback(t *testing.T) {
	for _, conflict := range []bool{false, true} {
		t.Run(map[bool]string{false: "upgrade", true: "rollback"}[conflict], func(t *testing.T) {
			s, path, library := createStory(t)
			ctx := context.Background()
			if _, err := s.Commit(ctx, storyRequest(library.Epoch, "story", 0, "old")); err != nil {
				t.Fatal(err)
			}
			before := readStory(t, s, library.Epoch, "story")
			connections, err := s.SaveConnections(ctx, modelSettings(library.Epoch))
			if err != nil {
				t.Fatal(err)
			}
			narration, err := s.SaveNarration(ctx, narrationRequest(library.Epoch, "story"))
			if err != nil {
				t.Fatal(err)
			}
			draft, err := s.SaveDraft(ctx, draftRequest(library.Epoch, "story", "Preserved unsent prose"))
			if err != nil {
				t.Fatal(err)
			}
			if _, err := s.db.Exec(`DROP TABLE author_notes`); err != nil {
				t.Fatal(err)
			}
			if _, err := s.db.Exec(`PRAGMA user_version=7`); err != nil {
				t.Fatal(err)
			}
			if conflict {
				if _, err := s.db.Exec(`CREATE TABLE author_notes(conflicting TEXT);`); err != nil {
					t.Fatal(err)
				}
			}
			s.Close()
			reopened, err := Open(path)
			if conflict {
				if err == nil {
					reopened.Close()
					t.Fatal("conflicting schema accepted")
				}
				db, err := sql.Open("sqlite", path)
				if err != nil {
					t.Fatal(err)
				}
				defer db.Close()
				var version int
				if err := db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != 7 {
					t.Fatal("failed upgrade changed version", version, err)
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			defer reopened.Close()
			if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
				t.Fatal("upgrade changed canon/epoch")
			}
			if got, err := reopened.ReadConnections(ctx, connections.ConnectionsRequest); err != nil || !reflect.DeepEqual(got, connections) {
				t.Fatal("upgrade changed model profiles", err)
			}
			if got, err := reopened.ReadNarration(ctx, narration.ReadRequest); err != nil || got != narration {
				t.Fatal("upgrade changed narration settings", err)
			}
			if got, err := reopened.ReadDraft(ctx, draft.DraftRequest); err != nil || !reflect.DeepEqual(got, draft) {
				t.Fatal("upgrade changed drafts", err)
			}
			if got, err := reopened.ReadAuthorNotes(ctx, ReadRequest{SchemaVersion, library.Epoch, "story"}); err != nil || got.Revision != 0 || got.Notes != "" {
				t.Fatal("default author notes missing", got, err)
			}
		})
	}
}

func TestForkCopiesIndependentCurrentAuthorNotesAtomically(t *testing.T) {
	s, _, fork := forkFixture(t)
	ctx := context.Background()
	req := authorNotesRequest(fork.Epoch, "story", "Keep the harbour fog thick and the watcher unnamed.")
	if _, err := s.SaveAuthorNotes(ctx, req); err != nil {
		t.Fatal(err)
	}
	if _, err := s.fork(ctx, fork, true); err == nil {
		t.Fatal("failure not injected")
	}
	var count int
	if err := s.db.QueryRow(`SELECT count(*) FROM author_notes WHERE adventure_id='fork'`).Scan(&count); err != nil || count != 0 {
		t.Fatal("partial fork notes survived", err)
	}
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	copied, err := s.ReadAuthorNotes(ctx, ReadRequest{SchemaVersion, fork.Epoch, "fork"})
	if err != nil || copied.Notes != req.Notes || copied.Revision != 1 {
		t.Fatal("current notes not copied", copied, err)
	}
	sourceUpdate := authorNotesRequest(fork.Epoch, "story", "New source direction.")
	sourceUpdate.ExpectedRevision = 1
	if _, err := s.SaveAuthorNotes(ctx, sourceUpdate); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	if got, err := s.ReadAuthorNotes(ctx, copied.ReadRequest); err != nil || got != copied {
		t.Fatal("source/replayed fork changed destination notes", got, err)
	}
	forkUpdate := authorNotesRequest(fork.Epoch, "fork", "Independent fork direction.")
	forkUpdate.ExpectedRevision = 1
	if _, err := s.SaveAuthorNotes(ctx, forkUpdate); err != nil {
		t.Fatal(err)
	}
	source, err := s.ReadAuthorNotes(ctx, sourceUpdate.ReadRequest)
	if err != nil || source.Notes != sourceUpdate.Notes || source.Revision != 2 {
		t.Fatal("fork changed source notes", source, err)
	}
	destination, err := s.ReadAuthorNotes(ctx, forkUpdate.ReadRequest)
	if err != nil || destination.Notes != forkUpdate.Notes || destination.Revision != 2 {
		t.Fatal("fork notes not independently owned", destination, err)
	}
}
