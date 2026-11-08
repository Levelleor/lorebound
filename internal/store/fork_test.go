package store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"
	"sync"
	"testing"
)

func forkFixture(t *testing.T) (*Store, string, ForkRequest) {
	t.Helper()
	s, path, library := createStory(t)
	for i := 0; i < 3; i++ {
		if _, err := s.Commit(context.Background(), storyRequest(library.Epoch, "story", int64(i), fmt.Sprint(i))); err != nil {
			t.Fatal(err)
		}
	}
	return s, path, ForkRequest{SchemaVersion: SchemaVersion, Epoch: library.Epoch, OperationID: "fork-copy", SourceAdventureID: "story", ExpectedVersion: 3, TurnID: "turn-1", AdventureID: "fork", Title: "A separate future"}
}

func TestForkPrefixIsolationDurabilityAndReceipt(t *testing.T) {
	s, path, req := forkFixture(t)
	ctx := context.Background()
	source := readStory(t, s, req.Epoch, "story")
	result, err := s.Fork(ctx, req)
	if err != nil || result.Version != 2 || result.Replayed {
		t.Fatalf("fork: %+v %v", result, err)
	}
	fork := readStory(t, s, req.Epoch, "fork")
	if !reflect.DeepEqual(fork.Turns, source.Turns[:2]) || fork.Baseline != source.Baseline || fork.Adventure.Title != req.Title {
		t.Fatalf("incorrect prefix: %+v", fork)
	}
	if got := readStory(t, s, req.Epoch, "story"); !reflect.DeepEqual(got, source) {
		t.Fatal("fork changed source")
	}
	// No copied source receipts; the same operation ID is independent in another adventure.
	next := storyRequest(req.Epoch, "fork", 2, "fork-future")
	next.OperationID = "commit-0"
	if _, err = s.Commit(ctx, next); err != nil {
		t.Fatal(err)
	}
	if _, err = s.Commit(ctx, storyRequest(req.Epoch, "story", 3, "source-future")); err != nil {
		t.Fatal(err)
	}
	wantSource := readStory(t, s, req.Epoch, "story")
	wantFork := readStory(t, s, req.Epoch, "fork")
	if wantFork.Turns[2].ID == wantSource.Turns[2].ID || len(wantSource.Turns) != 4 {
		t.Fatal("futures coupled")
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if !reflect.DeepEqual(readStory(t, reopened, req.Epoch, "story"), wantSource) || !reflect.DeepEqual(readStory(t, reopened, req.Epoch, "fork"), wantFork) {
		t.Fatal("restart lost independent histories")
	}
	result.Replayed = true
	if got, err := reopened.Fork(ctx, req); err != nil || got != result {
		t.Fatalf("recover after source/destination advanced: %+v %v", got, err)
	}
	changed := req
	changed.Title = "changed"
	if _, err = reopened.Fork(ctx, changed); !errors.Is(err, ErrOperationID) {
		t.Fatalf("changed request: %v", err)
	}
	if _, err = reopened.db.Exec(`UPDATE library_meta SET epoch='replacement'`); err != nil {
		t.Fatal(err)
	}
	if _, err = reopened.Fork(ctx, req); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("epoch before receipt: %v", err)
	}
}

func TestForkRejectedRequestsLeaveNoDestination(t *testing.T) {
	cases := []struct {
		name   string
		change func(*ForkRequest)
		want   error
	}{
		{"old wire", func(r *ForkRequest) { r.SchemaVersion = 1 }, ErrInvalidRequest},
		{"wrong epoch", func(r *ForkRequest) { r.Epoch = "wrong" }, ErrWrongEpoch},
		{"empty epoch", func(r *ForkRequest) { r.Epoch = "" }, ErrInvalidRequest},
		{"stale source", func(r *ForkRequest) { r.ExpectedVersion = 2 }, ErrStaleVersion},
		{"baseline", func(r *ForkRequest) { r.ExpectedVersion = 0 }, ErrInvalidRequest},
		{"unsafe version", func(r *ForkRequest) { r.ExpectedVersion = 9007199254740992 }, ErrInvalidRequest},
		{"missing source", func(r *ForkRequest) { r.SourceAdventureID = "missing" }, ErrNotFound},
		{"same source", func(r *ForkRequest) { r.AdventureID = "story" }, ErrInvalidRequest},
		{"existing destination", func(r *ForkRequest) { r.AdventureID = "other" }, ErrAdventureExists},
		{"provisional boundary", func(r *ForkRequest) { r.TurnID = "provisional" }, ErrInvalidRequest},
		{"passage boundary", func(r *ForkRequest) { r.TurnID = "authored-1" }, ErrInvalidRequest},
		{"blank title", func(r *ForkRequest) { r.Title = " " }, ErrInvalidRequest},
		{"long title", func(r *ForkRequest) { r.Title = strings.Repeat("x", 161) }, ErrInvalidRequest},
		{"bad ID", func(r *ForkRequest) { r.OperationID = "bad:id" }, ErrInvalidRequest},
		{"reuse append", func(r *ForkRequest) { r.OperationID = "commit-0" }, ErrOperationID},
		{"reuse create", func(r *ForkRequest) { r.OperationID = "create-story" }, ErrOperationID},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			s, _, req := forkFixture(t)
			before, _ := s.List(context.Background())
			tc.change(&req)
			if _, err := s.Fork(context.Background(), req); !errors.Is(err, tc.want) {
				t.Fatalf("got %v want %v", err, tc.want)
			}
			after, _ := s.List(context.Background())
			if !reflect.DeepEqual(before, after) {
				t.Fatal("partial destination")
			}
		})
	}
}

func TestForkBoundariesRollbackAndCorruption(t *testing.T) {
	for _, boundary := range []int{0, 1, 2} {
		t.Run(fmt.Sprint(boundary), func(t *testing.T) {
			s, _, req := forkFixture(t)
			req.TurnID = fmt.Sprintf("turn-%d", boundary)
			if _, err := s.fork(context.Background(), req, true); err == nil {
				t.Fatal("injected copy succeeded")
			}
			if _, err := s.Read(context.Background(), ReadRequest{SchemaVersion, req.Epoch, req.AdventureID}); !errors.Is(err, ErrNotFound) {
				t.Fatal("partial fork")
			}
			var count int
			if err := s.db.QueryRow(`SELECT count(*) FROM operations WHERE operation_id=?`, storyReceiptKey(req.SourceAdventureID, req.OperationID)).Scan(&count); err != nil || count != 0 {
				t.Fatalf("receipt survived: %d %v", count, err)
			}
			if _, err := s.Fork(context.Background(), req); err != nil {
				t.Fatal(err)
			}
			got := readStory(t, s, req.Epoch, "fork")
			if len(got.Turns) != boundary+1 {
				t.Fatal("incorrect boundary")
			}
			appendReq := storyRequest(req.Epoch, "story", 3, "after-fork")
			appendReq.OperationID = req.OperationID
			if _, err := s.Commit(context.Background(), appendReq); !errors.Is(err, ErrOperationID) {
				t.Fatalf("append reused Fork op: %v", err)
			}
		})
	}
	for _, query := range []string{
		`UPDATE turns SET events='[{"type":"unknown"}]' WHERE adventure_id='story' AND sequence=1`,
		`DELETE FROM passages WHERE adventure_id='story' AND id='authored-1'`,
		`UPDATE turns SET sequence=7 WHERE adventure_id='story' AND sequence=3`,
		`UPDATE passages SET id='turn-0' WHERE adventure_id='story' AND id='generated-2'`,
	} {
		s, _, req := forkFixture(t)
		if _, err := s.db.Exec(query); err != nil {
			t.Fatal(err)
		}
		if _, err := s.Fork(context.Background(), req); !errors.Is(err, ErrUnsupportedHistory) {
			t.Fatalf("corrupt source: %v", err)
		}
	}
}

func TestForkConcurrentSourceAndIdenticalRequests(t *testing.T) {
	s, _, req := forkFixture(t)
	ctx := context.Background()
	var wait sync.WaitGroup
	errs := make(chan error, 3)
	for i := 0; i < 2; i++ {
		wait.Add(1)
		go func() { defer wait.Done(); _, err := s.Fork(ctx, req); errs <- err }()
	}
	wait.Add(1)
	go func() {
		defer wait.Done()
		_, err := s.Commit(ctx, storyRequest(req.Epoch, "story", 3, "concurrent"))
		errs <- err
	}()
	wait.Wait()
	close(errs)
	for err := range errs {
		if err != nil && !errors.Is(err, ErrStaleVersion) {
			t.Fatal(err)
		}
	}
	library, err := s.List(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(library.Adventures) == 3 {
		fork := readStory(t, s, req.Epoch, "fork")
		if fork.Adventure.Version != 2 || len(fork.Turns) != 2 {
			t.Fatal("mixed copy")
		}
	} else if len(library.Adventures) != 2 {
		t.Fatal("duplicate/partial fork")
	}
}

func TestForkWireRejectsMissingNullAndUnknownFields(t *testing.T) {
	_, _, req := forkFixture(t)
	encoded, _ := json.Marshal(req)
	var fields map[string]json.RawMessage
	json.Unmarshal(encoded, &fields)
	for field := range fields {
		for _, null := range []bool{false, true} {
			var changed map[string]json.RawMessage
			json.Unmarshal(encoded, &changed)
			if null {
				changed[field] = json.RawMessage("null")
			} else {
				delete(changed, field)
			}
			body, _ := json.Marshal(changed)
			var decoded ForkRequest
			if err := json.Unmarshal(body, &decoded); err == nil {
				t.Fatalf("accepted missing/null %s", field)
			}
		}
	}
	var decoded ForkRequest
	if err := json.Unmarshal([]byte(strings.TrimSuffix(string(encoded), "}")+`,"sql":"bad"}`), &decoded); err == nil {
		t.Fatal("accepted unknown field")
	}
}
