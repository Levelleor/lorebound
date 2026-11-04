package store

import (
	"context"
	"errors"
	"path/filepath"
	"sync"
	"testing"
)

func openLibrary(t *testing.T) (*Store, string, Library) {
	t.Helper()
	path := filepath.Join(t.TempDir(), "lorebound.db")
	s, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { s.Close() })
	library, err := s.List(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	return s, path, library
}
func request(epoch, id string) CreateRequest {
	return CreateRequest{SchemaVersion: 1, Epoch: epoch, AdventureID: id, OperationID: "create-" + id, Title: "Untitled Adventure", Baseline: Baseline{SchemaVersion: 1}}
}
func TestAdventureDurabilityAndIsolation(t *testing.T) {
	s, path, initial := openLibrary(t)
	ctx := context.Background()
	if len(initial.Adventures) != 0 || initial.Epoch == "" {
		t.Fatalf("initial: %+v", initial)
	}
	for _, id := range []string{"first", "second"} {
		result, err := s.Create(ctx, request(initial.Epoch, id))
		if err != nil {
			t.Fatal(err)
		}
		if result.Replayed || result.Snapshot.Adventure.ID != id || result.Snapshot.Adventure.Version != 0 || result.Snapshot.Baseline.SchemaVersion != 1 {
			t.Fatalf("create: %+v", result)
		}
	}
	if err := s.Close(); err != nil {
		t.Fatal(err)
	}
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	library, err := reopened.List(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if library.Epoch != initial.Epoch || len(library.Adventures) != 2 {
		t.Fatalf("reopen: %+v", library)
	}
	for _, id := range []string{"first", "second"} {
		saved, err := reopened.Read(ctx, ReadRequest{SchemaVersion: 1, Epoch: initial.Epoch, AdventureID: id})
		if err != nil || saved.Adventure.ID != id || saved.Adventure.Title != "Untitled Adventure" || saved.Adventure.Version != 0 {
			t.Fatalf("read: %+v %v", saved, err)
		}
	}
	replay, err := reopened.Create(ctx, request(initial.Epoch, "first"))
	if err != nil || !replay.Replayed {
		t.Fatalf("receipt survives restart: %+v %v", replay, err)
	}
	t.Log("two independent zero-turn adventures and idempotency receipt survive SQLite close/reopen")
}
func TestCreationFailuresLeaveNoPartialAdventure(t *testing.T) {
	s, _, library := openLibrary(t)
	ctx := context.Background()
	first := request(library.Epoch, "first")
	if _, err := s.Create(ctx, first); err != nil {
		t.Fatal(err)
	}
	cases := []struct {
		name   string
		change func(*CreateRequest)
		want   error
	}{
		{"wrong schema", func(r *CreateRequest) { r.SchemaVersion = 2 }, ErrInvalidRequest},
		{"wrong baseline", func(r *CreateRequest) { r.Baseline.SchemaVersion = 2 }, ErrInvalidRequest},
		{"empty epoch", func(r *CreateRequest) { r.Epoch = "" }, ErrInvalidRequest},
		{"wrong epoch", func(r *CreateRequest) { r.Epoch = "stale" }, ErrWrongEpoch},
		{"invalid id", func(r *CreateRequest) { r.AdventureID = "bad id" }, ErrInvalidRequest},
		{"empty operation", func(r *CreateRequest) { r.OperationID = "" }, ErrInvalidRequest},
		{"blank title", func(r *CreateRequest) { r.Title = "  " }, ErrInvalidRequest},
		{"long title", func(r *CreateRequest) { r.Title = string(make([]byte, 161)) }, ErrInvalidRequest},
		{"existing adventure", func(r *CreateRequest) { r.AdventureID = "first" }, ErrAdventureExists},
		{"reused operation", func(r *CreateRequest) { r.OperationID = first.OperationID }, ErrOperationID},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := request(library.Epoch, "new")
			tc.change(&r)
			if _, err := s.Create(ctx, r); !errors.Is(err, tc.want) {
				t.Fatalf("got %v, want %v", err, tc.want)
			}
		})
	}
	failed := request(library.Epoch, "rollback")
	if _, err := s.create(ctx, failed, true); err == nil {
		t.Fatal("expected injected failure")
	}
	after, err := s.List(ctx)
	if err != nil || len(after.Adventures) != 1 {
		t.Fatalf("partial creation: %+v %v", after, err)
	}
	result, err := s.Create(ctx, failed)
	if err != nil || result.Replayed {
		t.Fatalf("failed receipt must roll back too: %+v %v", result, err)
	}
	t.Log("invalid/epoch/identity conflicts and injected failure preserve prior adventure; same request recovers")
}
func TestConcurrentDuplicateCreationAndEpochFencing(t *testing.T) {
	s, _, library := openLibrary(t)
	req := request(library.Epoch, "same")
	ctx := context.Background()
	var wg sync.WaitGroup
	results := make(chan CreateResult, 8)
	failures := make(chan error, 8)
	for i := 0; i < 8; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			result, err := s.Create(ctx, req)
			if err != nil {
				failures <- err
			} else {
				results <- result
			}
		}()
	}
	wg.Wait()
	close(results)
	close(failures)
	for err := range failures {
		t.Fatal(err)
	}
	fresh := 0
	for result := range results {
		if !result.Replayed {
			fresh++
		}
	}
	if fresh != 1 {
		t.Fatalf("fresh writes: %d", fresh)
	}
	// Simulate a changed library identity; no restore feature or migration is implemented.
	if _, err := s.db.Exec(`UPDATE library_meta SET epoch='replacement'`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Create(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("old receipt bypassed epoch: %v", err)
	}
	t.Log("eight concurrent identical requests create one adventure; old receipt cannot bypass epoch")
}
func TestReadsAndUnsupportedLibraryFailClosed(t *testing.T) {
	s, path, library := openLibrary(t)
	ctx := context.Background()
	if _, err := s.Read(ctx, ReadRequest{1, library.Epoch, "missing"}); !errors.Is(err, ErrNotFound) {
		t.Fatalf("missing: %v", err)
	}
	if _, err := s.Read(ctx, ReadRequest{1, "wrong", "missing"}); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("epoch: %v", err)
	}
	if _, err := s.Read(ctx, ReadRequest{2, library.Epoch, "missing"}); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("schema: %v", err)
	}
	if _, err := s.db.Exec(`PRAGMA user_version=999`); err != nil {
		t.Fatal(err)
	}
	s.Close()
	if other, err := Open(path); !errors.Is(err, ErrUnsupportedLibrary) {
		if other != nil {
			other.Close()
		}
		t.Fatalf("future schema: %v", err)
	}
}
func TestStorageFailureAndCancelledRequest(t *testing.T) {
	s, _, library := openLibrary(t)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := s.Create(ctx, request(library.Epoch, "cancelled")); err == nil {
		t.Fatal("cancelled request saved")
	}
	if _, err := s.db.Exec(`PRAGMA query_only=ON`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Create(context.Background(), request(library.Epoch, "readonly")); err == nil {
		t.Fatal("read-only request saved")
	}
	if _, err := s.db.Exec(`PRAGMA query_only=OFF`); err != nil {
		t.Fatal(err)
	}
	list, err := s.List(context.Background())
	if err != nil || len(list.Adventures) != 0 {
		t.Fatalf("failure changed library: %+v %v", list, err)
	}
	if _, err := s.Create(context.Background(), request(library.Epoch, "readonly")); err != nil {
		t.Fatalf("recovery: %v", err)
	}
}
