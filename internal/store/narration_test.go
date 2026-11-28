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

func narrationRequest(epoch, id string) SaveNarrationRequest {
	return SaveNarrationRequest{ReadRequest: ReadRequest{SchemaVersion, epoch, id}, Style: NarrationStyle{
		Perspective: "third", Tense: "past", Genre: "Mystery", Tone: "Quietly ominous", Pacing: "slow", Length: "detailed", Instructions: "Keep the mystery unresolved.\nUse concrete sensory details.",
	}}
}

func TestNarrationIsolationConflictsAndReopen(t *testing.T) {
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
	req := narrationRequest(library.Epoch, "story")
	empty, err := s.ReadNarration(ctx, req.ReadRequest)
	if err != nil || empty.Revision != 0 || empty.Style != (NarrationStyle{}) {
		t.Fatal(empty, err)
	}
	saved, err := s.SaveNarration(ctx, req)
	if err != nil || saved.Revision != 1 || saved.Style != req.Style {
		t.Fatal(saved, err)
	}
	replayed, err := s.SaveNarration(ctx, req)
	if err != nil || replayed != saved {
		t.Fatal("uncertain save retry", replayed, err)
	}
	req.Style.Tone = "An obsolete tab"
	if _, err := s.SaveNarration(ctx, req); !errors.Is(err, ErrNarrationChanged) {
		t.Fatal("stale save accepted", err)
	}
	req.Epoch = "wrong"
	if _, err := s.SaveNarration(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatal("wrong epoch accepted", err)
	}
	req.Epoch = library.Epoch
	req.AdventureID = "missing"
	if _, err := s.SaveNarration(ctx, req); !errors.Is(err, ErrNotFound) {
		t.Fatal("missing adventure accepted", err)
	}
	other, err := s.ReadNarration(ctx, ReadRequest{SchemaVersion, library.Epoch, "other"})
	if err != nil || other.Style != (NarrationStyle{}) {
		t.Fatal("adventure settings leaked", other, err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("settings changed canon")
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	got, err := reopened.ReadNarration(ctx, saved.ReadRequest)
	if err != nil || got != saved {
		t.Fatal("settings lost on reopen", got, err)
	}
	if got, err := reopened.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
		t.Fatal("settings changed draft", err)
	}
	if got, err := reopened.Commit(ctx, commit); err != nil || !got.Replayed {
		t.Fatal("settings changed receipt", err)
	}
}

func TestNarrationStrictValidationAndRollback(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	for _, change := range []func(*SaveNarrationRequest){
		func(r *SaveNarrationRequest) { r.SchemaVersion = 0 },
		func(r *SaveNarrationRequest) { r.ExpectedRevision = -1 },
		func(r *SaveNarrationRequest) { r.ExpectedRevision = 9007199254740991 },
		func(r *SaveNarrationRequest) { r.Style.Perspective = "omniscient" },
		func(r *SaveNarrationRequest) { r.Style.Tense = "future" },
		func(r *SaveNarrationRequest) { r.Style.Pacing = "unsupported" },
		func(r *SaveNarrationRequest) { r.Style.Length = "unsupported" },
		func(r *SaveNarrationRequest) { r.Style.Genre = strings.Repeat("x", 201) },
		func(r *SaveNarrationRequest) { r.Style.Tone = string([]byte{0xff}) },
		func(r *SaveNarrationRequest) { r.Style.Instructions = strings.Repeat("x", 2001) },
	} {
		req := narrationRequest(library.Epoch, "story")
		change(&req)
		if _, err := s.SaveNarration(ctx, req); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid settings accepted", err)
		}
	}
	req := narrationRequest(library.Epoch, "story")
	valid, _ := json.Marshal(req)
	for _, data := range []string{
		strings.Replace(string(valid), `"expectedRevision":0,`, "", 1),
		strings.Replace(string(valid), `"tone":"Quietly ominous"`, `"tone":null`, 1),
		strings.Replace(string(valid), `"perspective":"third",`, "", 1),
		strings.Replace(string(valid), `"style":{`, `"style":{"apiKey":"unexpected",`, 1),
	} {
		var decoded SaveNarrationRequest
		if err := json.Unmarshal([]byte(data), &decoded); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid wire settings accepted", data, err)
		}
	}
	if _, err := s.db.Exec(`CREATE TRIGGER fail_narration BEFORE INSERT ON narration_settings BEGIN SELECT RAISE(ABORT,'injected_failure'); END;`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.SaveNarration(ctx, req); err == nil {
		t.Fatal("injected failure accepted")
	}
	got, err := s.ReadNarration(ctx, req.ReadRequest)
	if err != nil || got.Revision != 0 || got.Style != (NarrationStyle{}) {
		t.Fatal("failed save changed settings", got, err)
	}
}

func TestNarrationUpgradeAndRollback(t *testing.T) {
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
			if _, err := s.db.Exec(`ALTER TABLE model_profiles DROP COLUMN context_limits; DROP TABLE lore_entries; DROP TABLE author_notes; DROP TABLE narration_settings; PRAGMA user_version=6;`); err != nil {
				t.Fatal(err)
			}
			if conflict {
				if _, err := s.db.Exec(`CREATE TABLE narration_settings(conflicting TEXT);`); err != nil {
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
				if err := db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != 6 {
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
			if got, err := reopened.ReadNarration(ctx, ReadRequest{SchemaVersion, library.Epoch, "story"}); err != nil || got.Revision != 0 {
				t.Fatal("default settings missing", err)
			}
		})
	}
}

func TestForkCopiesIndependentCurrentNarrationAtomically(t *testing.T) {
	s, _, fork := forkFixture(t)
	ctx := context.Background()
	req := narrationRequest(fork.Epoch, "story")
	if _, err := s.SaveNarration(ctx, req); err != nil {
		t.Fatal(err)
	}
	if _, err := s.fork(ctx, fork, true); err == nil {
		t.Fatal("failure not injected")
	}
	var count int
	if err := s.db.QueryRow(`SELECT count(*) FROM narration_settings WHERE adventure_id='fork'`).Scan(&count); err != nil || count != 0 {
		t.Fatal("partial fork settings survived", err)
	}
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	copied, err := s.ReadNarration(ctx, ReadRequest{SchemaVersion, fork.Epoch, "fork"})
	if err != nil || copied.Style != req.Style || copied.Revision != 1 {
		t.Fatal("current settings not copied", copied, err)
	}
	req.ExpectedRevision = 1
	req.Style.Tone = "New source direction"
	if _, err := s.SaveNarration(ctx, req); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	if got, err := s.ReadNarration(ctx, copied.ReadRequest); err != nil || got != copied {
		t.Fatal("source/replayed fork changed destination", got, err)
	}
	if _, err := s.SaveNarration(ctx, SaveNarrationRequest{ReadRequest: copied.ReadRequest, ExpectedRevision: 1, Style: NarrationStyle{Tone: "Independent"}}); err != nil {
		t.Fatal(err)
	}
	if got, err := s.ReadNarration(ctx, req.ReadRequest); err != nil || got.Style != req.Style {
		t.Fatal("fork changed source", got, err)
	}
}
