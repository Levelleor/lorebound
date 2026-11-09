package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
)

func modelSettings(epoch string) SaveConnectionsRequest {
	return SaveConnectionsRequest{
		ConnectionsRequest: ConnectionsRequest{SchemaVersion, epoch}, Mode: "local", ActiveProfileID: "local",
		Profiles: []ModelProfile{{ID: "local", Name: "My llama.cpp", Kind: "llamacpp", BaseURL: "http://127.0.0.1:8081/v1", Model: "manual-model", TimeoutMS: 120000}},
	}
}

func TestConnectionsPersistenceConflictEpochAndCanonicalIsolation(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	first := storyRequest(library.Epoch, "story", 0, "first")
	if _, err := s.Commit(ctx, first); err != nil {
		t.Fatal(err)
	}
	before := readStory(t, s, library.Epoch, "story")
	draft := draftRequest(library.Epoch, "story", "Unfinished input")
	if _, err := s.SaveDraft(ctx, draft); err != nil {
		t.Fatal(err)
	}
	req := modelSettings(library.Epoch)
	settings, err := s.SaveConnections(ctx, req)
	if err != nil || settings.Revision != 1 || settings.ActiveProfileID != "local" {
		t.Fatalf("save: %+v %v", settings, err)
	}
	same, err := s.SaveConnections(ctx, req)
	if err != nil || !reflect.DeepEqual(same, settings) {
		t.Fatal("lost response retry changed settings", err)
	}
	req.Profiles[0].Name = "Stale tab"
	if _, err := s.SaveConnections(ctx, req); !errors.Is(err, ErrSettingsChanged) {
		t.Fatal("stale save accepted", err)
	}
	req.ExpectedRevision = 1
	req.Epoch = "wrong"
	if _, err := s.SaveConnections(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatal("wrong epoch accepted", err)
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
	got, err := reopened.ReadConnections(ctx, ConnectionsRequest{SchemaVersion, library.Epoch})
	if err != nil || !reflect.DeepEqual(got, settings) {
		t.Fatal("settings did not survive restart", err)
	}
	if got, err := reopened.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
		t.Fatal("settings changed draft", err)
	}
	if got, err := reopened.Commit(ctx, first); err != nil || !got.Replayed {
		t.Fatal("settings changed receipt", err)
	}
	// Deleting the active profile keeps Local mode without a fallback selection.
	req = SaveConnectionsRequest{ConnectionsRequest: ConnectionsRequest{SchemaVersion, library.Epoch}, ExpectedRevision: 1, Mode: "local", Profiles: []ModelProfile{}}
	got, err = reopened.SaveConnections(ctx, req)
	if err != nil || got.Mode != "local" || got.ActiveProfileID != "" || len(got.Profiles) != 0 {
		t.Fatal("delete selected fallback", err)
	}
}

func TestConnectionsValidationAndAtomicRollback(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	for _, endpoint := range []string{"file:///tmp/model", "javascript:alert(1)", "http://user:password@localhost/v1", "http://localhost/v1?key=secret", "http://localhost/v1#secret", "http://localhost/v1?", "http://localhost/white space", "http:\\localhost", "http://localhost:99999/v1"} {
		req := modelSettings(library.Epoch)
		req.Profiles[0].BaseURL = endpoint
		if _, err := s.SaveConnections(ctx, req); !errors.Is(err, ErrInvalidRequest) {
			t.Fatalf("unsafe endpoint accepted: %q %v", endpoint, err)
		}
	}
	for _, change := range []func(*SaveConnectionsRequest){
		func(r *SaveConnectionsRequest) { r.Profiles = append(r.Profiles, r.Profiles[0]) },
		func(r *SaveConnectionsRequest) { r.Profiles[0].TimeoutMS = 0 },
		func(r *SaveConnectionsRequest) { r.Profiles[0].Kind = "openai" },
		func(r *SaveConnectionsRequest) { r.ActiveProfileID = "missing" },
		func(r *SaveConnectionsRequest) { r.Mode = "simulation" },
	} {
		req := modelSettings(library.Epoch)
		change(&req)
		if _, err := s.SaveConnections(ctx, req); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal("invalid settings accepted", err)
		}
	}
	valid, _ := json.Marshal(modelSettings(library.Epoch))
	var fields map[string]any
	if err := json.Unmarshal(valid, &fields); err != nil {
		t.Fatal(err)
	}
	fields["profiles"].([]any)[0].(map[string]any)["apiKey"] = "must-never-persist"
	secret, _ := json.Marshal(fields)
	var decoded SaveConnectionsRequest
	if err := json.Unmarshal(secret, &decoded); !errors.Is(err, ErrInvalidRequest) {
		t.Fatal("secret field accepted", err)
	}
	delete(fields, "expectedRevision")
	missing, _ := json.Marshal(fields)
	if err := json.Unmarshal(missing, &decoded); !errors.Is(err, ErrInvalidRequest) {
		t.Fatal("missing version accepted", err)
	}
	before, err := s.SaveConnections(ctx, modelSettings(library.Epoch))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := s.db.Exec(`CREATE TRIGGER fail_profile BEFORE INSERT ON model_profiles WHEN NEW.id='fail' BEGIN SELECT RAISE(ABORT,'injected'); END;`); err != nil {
		t.Fatal(err)
	}
	req := modelSettings(library.Epoch)
	req.ExpectedRevision = 1
	req.ActiveProfileID = "fail"
	req.Profiles[0].ID = "fail"
	if _, err := s.SaveConnections(ctx, req); err == nil {
		t.Fatal("injected failure committed")
	}
	after, err := s.ReadConnections(ctx, req.ConnectionsRequest)
	if err != nil || !reflect.DeepEqual(before, after) {
		t.Fatal("failed save partially deleted profiles/settings", err)
	}
}

func TestConnectionsUpgradePreservesCanonAndRollsBackConflicts(t *testing.T) {
	for _, conflict := range []bool{false, true} {
		t.Run(map[bool]string{false: "v5", true: "rollback"}[conflict], func(t *testing.T) {
			s, path, library := createStory(t)
			ctx := context.Background()
			commit := storyRequest(library.Epoch, "story", 0, "old")
			if _, err := s.Commit(ctx, commit); err != nil {
				t.Fatal(err)
			}
			before := readStory(t, s, library.Epoch, "story")
			draft := draftRequest(library.Epoch, "story", "Old draft")
			if _, err := s.SaveDraft(ctx, draft); err != nil {
				t.Fatal(err)
			}
			if _, err := s.db.Exec(`DROP TABLE model_settings; DROP TABLE model_profiles; PRAGMA user_version=5;`); err != nil {
				t.Fatal(err)
			}
			if conflict {
				if _, err := s.db.Exec(`CREATE TABLE model_profiles(id TEXT)`); err != nil {
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
				var version, settings int
				if err := db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != 5 {
					t.Fatal("failed upgrade changed version", err)
				}
				if err := db.QueryRow(`SELECT count(*) FROM sqlite_master WHERE name='model_settings'`).Scan(&settings); err != nil || settings != 0 {
					t.Fatal("failed upgrade left partial settings", err)
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
			if got, err := reopened.ReadDraft(ctx, draft.DraftRequest); err != nil || got.Text != draft.Text {
				t.Fatal("upgrade changed draft", err)
			}
			if result, err := reopened.Commit(ctx, commit); err != nil || !result.Replayed {
				t.Fatal("upgrade changed receipt", err)
			}
			if got, err := reopened.ReadConnections(ctx, ConnectionsRequest{SchemaVersion, library.Epoch}); err != nil || got.Mode != "simulation" || len(got.Profiles) != 0 {
				t.Fatal("upgrade did not initialise explicit simulation settings", err)
			}
		})
	}
}
