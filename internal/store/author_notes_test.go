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

func TestAuthorNotesLatestSaveIsolationAndReopen(t *testing.T) {
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
	if err != nil || empty.Notes != "" {
		t.Fatal(empty, err)
	}
	var rows int
	if err := s.db.QueryRow(`SELECT count(*) FROM author_notes`).Scan(&rows); err != nil || rows != 0 {
		t.Fatal("reading empty notes wrote a row", rows, err)
	}
	saved, err := s.SaveAuthorNotes(ctx, req)
	if err != nil || saved.Notes != req.Notes {
		t.Fatal(saved, err)
	}
	replayed, err := s.SaveAuthorNotes(ctx, req)
	if err != nil || replayed != saved {
		t.Fatal("uncertain save retry", replayed, err)
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
	if err != nil || other.Notes != "" {
		t.Fatal("adventure notes leaked", other, err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("notes changed canon")
	}
	if got, err := s.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
		t.Fatal("notes changed composer draft", err)
	}
	update := authorNotesRequest(library.Epoch, "story", "A fresh direction for the next attempt.")
	second, err := s.SaveAuthorNotes(ctx, update)
	if err != nil || second.Notes != update.Notes {
		t.Fatal("latest save did not replace notes", second, err)
	}
	if err := s.db.QueryRow(`SELECT count(*) FROM author_notes`).Scan(&rows); err != nil || rows != 1 {
		t.Fatal("expected one stored value", rows, err)
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
	if err != nil || accepted.Notes != limit.Notes {
		t.Fatal("4000 code points rejected", err)
	}
	valid, err := json.Marshal(authorNotesRequest(library.Epoch, "story", "A direction."))
	if err != nil {
		t.Fatal(err)
	}
	replaceNotes := func(value string) string {
		return strings.Replace(string(valid), `"A direction."`, value, 1)
	}
	for _, data := range []string{
		strings.Replace(string(valid), `,"notes":"A direction."`, "", 1),
		strings.Replace(string(valid), `"schemaVersion":4,`, `"schemaVersion":4,"expectedRevision":0,`, 1),
		replaceNotes("null"),
		replaceNotes("5"),
		replaceNotes(`["A direction."]`),
		replaceNotes(`{"text":"A direction."}`),
		replaceNotes(`"\uD800"`),
		replaceNotes(`"\udfff"`),
		replaceNotes(`"\ud800\u0041"`),
		replaceNotes(`"` + string([]byte{0xff}) + `"`),
	} {
		var decoded SaveAuthorNotesRequest
		if err := json.Unmarshal([]byte(data), &decoded); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid wire notes accepted", data, err)
		}
	}
	var decoded SaveAuthorNotesRequest
	if err := json.Unmarshal([]byte(replaceNotes(`"\ud83e\udd89 \ufffd \\ud800"`)), &decoded); err != nil || decoded.Notes != `🦉 � \ud800` {
		t.Fatal("valid Unicode and literal escapes must survive decoding", decoded, err)
	}
	if _, err := s.db.Exec(`CREATE TRIGGER fail_author_notes BEFORE INSERT ON author_notes BEGIN SELECT RAISE(ABORT,'injected_failure'); END;`); err != nil {
		t.Fatal(err)
	}
	failed := authorNotesRequest(library.Epoch, "story", "A failed direction.")
	if _, err := s.SaveAuthorNotes(ctx, failed); err == nil {
		t.Fatal("injected failure accepted")
	}
	got, err := s.ReadAuthorNotes(ctx, failed.ReadRequest)
	if err != nil || got.Notes != limit.Notes {
		t.Fatal("failed save changed notes", got, err)
	}
}

func TestAuthorNotesUpgradeAndRollback(t *testing.T) {
	for _, test := range []struct {
		name    string
		version int
		fail    bool
	}{
		{"v7-upgrade", 7, false},
		{"v7-rollback", 7, true},
		{"v8-upgrade", 8, false},
		{"v8-rollback", 8, true},
	} {
		t.Run(test.name, func(t *testing.T) {
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
			if _, err := s.db.Exec(dropContextBudgetColumns + `ALTER TABLE model_profiles DROP COLUMN context_limits; DROP TABLE lore_entries; DROP TABLE author_notes`); err != nil {
				t.Fatal(err)
			}
			wantNotes := ""
			if test.version == 8 {
				wantNotes = "Keep the saved direction. 🦉"
				if _, err := s.db.Exec(`CREATE TABLE author_notes (
 adventure_id TEXT PRIMARY KEY REFERENCES adventures(id) ON DELETE CASCADE,
 revision INTEGER NOT NULL, notes TEXT NOT NULL);
 PRAGMA user_version=8;`); err != nil {
					t.Fatal(err)
				}
				if _, err := s.db.Exec(`INSERT INTO author_notes VALUES('story', 12, ?)`, wantNotes); err != nil {
					t.Fatal(err)
				}
				if test.fail {
					if _, err := s.db.Exec(`CREATE INDEX incompatible_revision ON author_notes(revision)`); err != nil {
						t.Fatal(err)
					}
				}
			} else {
				if _, err := s.db.Exec(`PRAGMA user_version=7`); err != nil {
					t.Fatal(err)
				}
				if test.fail {
					if _, err := s.db.Exec(`CREATE TABLE author_notes(conflicting TEXT)`); err != nil {
						t.Fatal(err)
					}
				}
			}
			s.Close()
			reopened, err := Open(path)
			if test.fail {
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
				if err := db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != test.version {
					t.Fatal("failed upgrade changed version", version, err)
				}
				if test.version == 8 {
					var revision int
					var notes string
					if err := db.QueryRow(`SELECT revision,notes FROM author_notes WHERE adventure_id='story'`).Scan(&revision, &notes); err != nil || revision != 12 || notes != wantNotes {
						t.Fatal("failed upgrade changed notes", revision, notes, err)
					}
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
			if got, err := reopened.ReadAuthorNotes(ctx, ReadRequest{SchemaVersion, library.Epoch, "story"}); err != nil || got.Notes != wantNotes {
				t.Fatal("upgrade changed author notes", got, err)
			}
			var revisionColumns int
			if err := reopened.db.QueryRow(`SELECT count(*) FROM pragma_table_info('author_notes') WHERE name='revision'`).Scan(&revisionColumns); err != nil || revisionColumns != 0 {
				t.Fatal("upgrade left a revision column", revisionColumns, err)
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
	if err != nil || copied.Notes != req.Notes {
		t.Fatal("current notes not copied", copied, err)
	}
	sourceUpdate := authorNotesRequest(fork.Epoch, "story", "New source direction.")
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
	if _, err := s.SaveAuthorNotes(ctx, forkUpdate); err != nil {
		t.Fatal(err)
	}
	source, err := s.ReadAuthorNotes(ctx, sourceUpdate.ReadRequest)
	if err != nil || source.Notes != sourceUpdate.Notes {
		t.Fatal("fork changed source notes", source, err)
	}
	destination, err := s.ReadAuthorNotes(ctx, forkUpdate.ReadRequest)
	if err != nil || destination.Notes != forkUpdate.Notes {
		t.Fatal("fork notes not independently owned", destination, err)
	}
}
