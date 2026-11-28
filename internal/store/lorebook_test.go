package store

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
)

func TestLorebookUpgradePersistenceAndConflicts(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	target := ReadRequest{SchemaVersion, library.Epoch, "story"}
	before := readStory(t, s, library.Epoch, "story")
	if _, err := s.SaveDraft(ctx, draftRequest(library.Epoch, "story", "Unsent passage")); err != nil {
		t.Fatal(err)
	}
	draft, err := s.ReadDraft(ctx, draftRequest(library.Epoch, "story", "").DraftRequest)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := s.db.Exec(`DROP TABLE lore_entries; PRAGMA user_version=9`); err != nil {
		t.Fatal(err)
	}
	s.Close()
	s, err = Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer s.Close()
	if book, err := s.ReadLorebook(ctx, target); err != nil || book.Entries == nil || len(book.Entries) != 0 {
		t.Fatal(book, err)
	}
	req := SaveLoreEntryRequest{target, LoreEntry{ID: "observatory", Kind: "place", Title: "The Observatory", Description: "An old telescope.\nThe roof opens at dusk."}}
	created, err := s.SaveLoreEntry(ctx, req)
	if err != nil || created.Revision != 1 || created.Included || created.ID != req.Entry.ID {
		t.Fatal(created, err)
	}
	if repeated, err := s.SaveLoreEntry(ctx, req); err != nil || repeated != created {
		t.Fatal("repeat create", repeated, err)
	}
	req.Entry = created
	req.Entry.Included = true
	req.Entry.Title = "The Hill Observatory"
	updated, err := s.SaveLoreEntry(ctx, req)
	if err != nil || updated.Revision != 2 || updated.ID != created.ID || !updated.Included {
		t.Fatal(updated, err)
	}
	if repeated, err := s.SaveLoreEntry(ctx, req); err != nil || repeated != updated {
		t.Fatal("repeat edit", repeated, err)
	}
	req.Entry.Description = "Stale edit"
	if _, err := s.SaveLoreEntry(ctx, req); !errors.Is(err, ErrStaleVersion) {
		t.Fatal("stale edit", err)
	}
	if _, err := s.db.Exec(`CREATE TRIGGER fail_lore BEFORE UPDATE ON lore_entries BEGIN SELECT RAISE(ABORT,'injected_failure'); END`); err != nil {
		t.Fatal(err)
	}
	req.Entry.Revision = updated.Revision
	if _, err := s.SaveLoreEntry(ctx, req); err == nil {
		t.Fatal("failed write accepted")
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("Lorebook changed canon")
	}
	if got, err := s.ReadDraft(ctx, draftRequest(library.Epoch, "story", "").DraftRequest); err != nil || got != draft {
		t.Fatal("Lorebook changed draft", got, err)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if book, err := reopened.ReadLorebook(ctx, target); err != nil || !reflect.DeepEqual(book.Entries, []LoreEntry{updated}) {
		t.Fatal(book, err)
	}
	if book, err := reopened.ReadLorebook(ctx, ReadRequest{SchemaVersion, library.Epoch, "other"}); err != nil || len(book.Entries) != 0 {
		t.Fatal("another adventure received lore", book, err)
	}
}

func TestLorebookValidationAndIndependentFork(t *testing.T) {
	s, _, fork := forkFixture(t)
	ctx := context.Background()
	target := ReadRequest{SchemaVersion, fork.Epoch, "story"}
	entry := LoreEntry{ID: "bell", Kind: "object", Title: "The bell", Description: "An old bell."}
	for _, invalid := range []LoreEntry{
		{ID: "bell", Kind: "unknown", Title: "The bell"},
		{ID: "bell", Kind: "object", Title: ""},
		{ID: "bell", Kind: "object", Title: "Bell", Description: string([]byte{0xff})},
		{ID: "bell", Kind: "object", Title: "Bell", Included: true},
	} {
		if _, err := s.SaveLoreEntry(ctx, SaveLoreEntryRequest{target, invalid}); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal(invalid, err)
		}
	}
	for _, wire := range []string{
		`{"schemaVersion":4,"epoch":"epoch","adventureId":"story","entry":{"id":"bell","revision":0,"kind":"object","title":"\ud800","description":"","included":false}}`,
		`{"schemaVersion":4,"epoch":"epoch","adventureId":"story","entry":{"id":"bell","revision":0,"kind":"object","title":"Bell","description":""}}`,
		`{"schemaVersion":4,"epoch":"epoch","adventureId":"story","entry":{"id":"bell","revision":0,"kind":"object","title":"Bell","description":"","included":false,"extra":1}}`,
	} {
		var req SaveLoreEntryRequest
		if err := json.Unmarshal([]byte(wire), &req); !errors.Is(err, ErrInvalidRequest) {
			t.Fatal(wire, err)
		}
	}
	if _, err := s.SaveLoreEntry(ctx, SaveLoreEntryRequest{ReadRequest{SchemaVersion, "old", "story"}, entry}); !errors.Is(err, ErrWrongEpoch) {
		t.Fatal(err)
	}
	if _, err := s.ReadLorebook(ctx, ReadRequest{SchemaVersion, fork.Epoch, "missing"}); !errors.Is(err, ErrNotFound) {
		t.Fatal(err)
	}
	saved, err := s.SaveLoreEntry(ctx, SaveLoreEntryRequest{target, entry})
	if err != nil {
		t.Fatal(err)
	}
	saved.Included = true
	saved, err = s.SaveLoreEntry(ctx, SaveLoreEntryRequest{target, saved})
	if err != nil {
		t.Fatal(err)
	}
	forkTarget := ReadRequest{SchemaVersion, fork.Epoch, "fork"}
	if _, err := s.fork(ctx, fork, true); err == nil {
		t.Fatal("injected failure was ignored")
	}
	if _, err := s.ReadLorebook(ctx, forkTarget); !errors.Is(err, ErrNotFound) {
		t.Fatal("partial Fork", err)
	}
	if _, err := s.Fork(ctx, fork); err != nil {
		t.Fatal(err)
	}
	copy, err := s.ReadLorebook(ctx, forkTarget)
	want := saved
	want.Revision = 1
	if err != nil || !reflect.DeepEqual(copy.Entries, []LoreEntry{want}) {
		t.Fatal(copy, err)
	}
	want.Included = false
	if _, err := s.SaveLoreEntry(ctx, SaveLoreEntryRequest{forkTarget, want}); err != nil {
		t.Fatal(err)
	}
	if source, err := s.ReadLorebook(ctx, target); err != nil || !reflect.DeepEqual(source.Entries, []LoreEntry{saved}) {
		t.Fatal("Fork edit changed source", source, err)
	}
}
