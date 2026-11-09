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

func draftRequest(epoch, id, text string) SaveDraftRequest {
	return SaveDraftRequest{DraftRequest{SchemaVersion, epoch, id, "composer_story"}, text}
}

func TestDraftLatestValueIsolationAndReopen(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	before := readStory(t, s, library.Epoch, "story")
	for _, text := range []string{"First tab", "Another tab replaces it. 🦉\n\n<script>plain text</script>", ""} {
		req := draftRequest(library.Epoch, "story", text)
		if _, err := s.SaveDraft(ctx, req); err != nil {
			t.Fatal(err)
		}
		got, err := s.ReadDraft(ctx, req.DraftRequest)
		if err != nil || got.Text != text {
			t.Fatalf("draft: %+v %v", got, err)
		}
	}
	latest := draftRequest(library.Epoch, "story", "Restored after process restart. 🦉")
	if _, err := s.SaveDraft(ctx, latest); err != nil {
		t.Fatal(err)
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("autosave changed canon")
	}
	other, err := s.ReadDraft(ctx, draftRequest(library.Epoch, "other", "").DraftRequest)
	if err != nil || other.Text != "" {
		t.Fatalf("draft leaked: %+v %v", other, err)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	got, err := reopened.ReadDraft(ctx, latest.DraftRequest)
	if err != nil || got.Text != latest.Text {
		t.Fatalf("reopen: %+v %v", got, err)
	}
}

func TestDraftConsumptionIsAtomicAndReceiptSafe(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	commit := storyRequest(library.Epoch, "story", 0, "first")
	req := draftRequest(library.Epoch, "story", documentText(commit.Turn.Passages[0].Body))
	if _, err := s.SaveDraft(ctx, req); err != nil {
		t.Fatal(err)
	}
	if _, err := s.commit(ctx, commit, true); err == nil {
		t.Fatal("injected failure accepted")
	}
	if got, err := s.ReadDraft(ctx, req.DraftRequest); err != nil || got.Text != req.Text {
		t.Fatalf("rollback lost draft: %+v %v", got, err)
	}
	if _, err := s.Commit(ctx, commit); err != nil {
		t.Fatal(err)
	}
	if got, err := s.ReadDraft(ctx, req.DraftRequest); err != nil || got.Text != "" {
		t.Fatalf("accepted draft not consumed: %+v %v", got, err)
	}
	req.Text = "New input after acceptance"
	if _, err := s.SaveDraft(ctx, req); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Commit(ctx, commit); err != nil {
		t.Fatal(err)
	}
	second := storyRequest(library.Epoch, "story", 1, "second")
	if _, err := s.Commit(ctx, second); err != nil {
		t.Fatal(err)
	}
	if got, err := s.ReadDraft(ctx, req.DraftRequest); err != nil || got.Text != req.Text {
		t.Fatalf("receipt or different authored input cleared newest draft: %+v %v", got, err)
	}
}

func TestDraftRejectsInvalidTargetsEpochsAndPayloads(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	valid := draftRequest(library.Epoch, "story", "Keep me")
	if _, err := s.SaveDraft(ctx, valid); err != nil {
		t.Fatal(err)
	}
	for _, mutate := range []func(*SaveDraftRequest){
		func(r *SaveDraftRequest) { r.Epoch = "old" },
		func(r *SaveDraftRequest) { r.SchemaVersion = 1 },
		func(r *SaveDraftRequest) { r.AdventureID = "missing" },
		func(r *SaveDraftRequest) { r.Target = "passage" },
		func(r *SaveDraftRequest) { r.Text = strings.Repeat("🦉", 20001) },
		func(r *SaveDraftRequest) { r.Text = string([]byte{0xff}) },
	} {
		req := valid
		mutate(&req)
		if _, err := s.SaveDraft(ctx, req); err == nil {
			t.Fatalf("accepted invalid draft: %+v", req)
		}
	}
	for _, raw := range []string{`{"text":null}`, `{"text":1}`, `{"text":"", "extra":true}`, `{}`} {
		var req SaveDraftRequest
		if err := json.Unmarshal([]byte(raw), &req); err == nil {
			t.Fatalf("accepted malformed request: %s", raw)
		}
	}
	if _, err := s.db.Exec(`UPDATE library_meta SET epoch='new-epoch'`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.ReadDraft(ctx, valid.DraftRequest); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("old-epoch read: %v", err)
	}
	valid.Epoch = "new-epoch"
	got, err := s.ReadDraft(ctx, valid.DraftRequest)
	if err != nil || got.Text != valid.Text {
		t.Fatalf("invalid write modified stored draft: %+v %v", got, err)
	}
}

func TestDraftUpgradePreservesStoryAndFailsAtomically(t *testing.T) {
	for _, conflict := range []bool{false, true} {
		t.Run(map[bool]string{false: "v2 upgrade", true: "rollback"}[conflict], func(t *testing.T) {
			s, path, library := createStory(t)
			ctx := context.Background()
			commit := storyRequest(library.Epoch, "story", 0, "legacy")
			if _, err := s.Commit(ctx, commit); err != nil {
				t.Fatal(err)
			}
			before := readStory(t, s, library.Epoch, "story")
			setupSQL := `DROP TABLE model_settings; DROP TABLE model_profiles; DROP TABLE drafts; PRAGMA user_version=2;`
			if conflict {
				setupSQL = `PRAGMA user_version=2;`
			}
			if _, err := s.db.Exec(setupSQL); err != nil {
				t.Fatal(err)
			}
			s.Close()
			reopened, err := Open(path)
			if conflict {
				if err == nil {
					reopened.Close()
					t.Fatal("conflicting table accepted")
				}
				db, err := sql.Open("sqlite", path)
				if err != nil {
					t.Fatal(err)
				}
				defer db.Close()
				var version int
				if err := db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != 2 {
					t.Fatalf("failed upgrade changed version: %d %v", version, err)
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			defer reopened.Close()
			if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
				t.Fatal("upgrade changed story")
			}
			if result, err := reopened.Commit(ctx, commit); err != nil || !result.Replayed {
				t.Fatalf("upgrade lost receipt: %+v %v", result, err)
			}
		})
	}
}
