package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"
	"reflect"
	"strings"
	"sync"
	"testing"
)

func document(text string) Document {
	return Document{SchemaVersion: 1, Type: "doc", Content: []Paragraph{{Type: "paragraph", Content: []Inline{{Type: "text", Text: text}, {Type: "hard_break"}, {Type: "text", Text: "A second line."}}}, {Type: "paragraph", Content: []Inline{{Type: "text", Text: "Another paragraph."}}}}}
}
func storyRequest(epoch, adventure string, version int64, suffix string) CommitRequest {
	return CommitRequest{SchemaVersion: SchemaVersion, Epoch: epoch, AdventureID: adventure, OperationID: "commit-" + suffix, ExpectedVersion: version, Kind: "append_story_turn", Turn: Turn{SchemaVersion: 1, ID: "turn-" + suffix, Order: version + 1, Passages: []Passage{{ID: "authored-" + suffix, Source: "authored", Body: document("Impossible things may happen.")}, {ID: "generated-" + suffix, Source: "generated", Body: document("A simulated continuation.")}}, Events: []json.RawMessage{}}}
}
func createStory(t *testing.T) (*Store, string, Library) {
	t.Helper()
	s, path, library := openLibrary(t)
	for _, id := range []string{"story", "other"} {
		if _, err := s.Create(context.Background(), request(library.Epoch, id)); err != nil {
			t.Fatal(err)
		}
	}
	return s, path, library
}
func readStory(t *testing.T, s *Store, epoch, id string) Snapshot {
	t.Helper()
	snapshot, err := s.Read(context.Background(), ReadRequest{SchemaVersion, epoch, id})
	if err != nil {
		t.Fatal(err)
	}
	return snapshot
}
func TestStoryAtomicDurabilityAndOriginalReceipt(t *testing.T) {
	s, path, library := createStory(t)
	ctx := context.Background()
	first := storyRequest(library.Epoch, "story", 0, "first")
	result, err := s.Commit(ctx, first)
	if err != nil || result.Replayed || result.Version != 1 || result.TurnID != first.Turn.ID {
		t.Fatalf("first: %+v %v", result, err)
	}
	second := storyRequest(library.Epoch, "story", 1, "second")
	if _, err = s.Commit(ctx, second); err != nil {
		t.Fatal(err)
	}
	expected := readStory(t, s, library.Epoch, "story")
	if expected.Adventure.Version != 2 || len(expected.Turns) != 2 || !reflect.DeepEqual(expected.Turns, []Turn{first.Turn, second.Turn}) {
		t.Fatalf("history: %+v", expected)
	}
	if other := readStory(t, s, library.Epoch, "other"); other.Adventure.Version != 0 || len(other.Turns) != 0 {
		t.Fatalf("isolation: %+v", other)
	}
	s.Close()
	reopened, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer reopened.Close()
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, expected) {
		t.Fatalf("reopen mismatch: %+v", got)
	}
	replay, err := reopened.Commit(ctx, first)
	result.Replayed = true
	if err != nil || replay != result {
		t.Fatalf("original receipt: %+v %v; want %+v", replay, err, result)
	}
	if got := readStory(t, reopened, library.Epoch, "story"); !reflect.DeepEqual(got, expected) {
		t.Fatal("receipt mutated history")
	}
	changed := first
	changed.Turn.ID = "different"
	if _, err = reopened.Commit(ctx, changed); !errors.Is(err, ErrOperationID) {
		t.Fatalf("changed payload: %v", err)
	}
	// Same-adventure creation and Story receipts cannot be confused.
	changed = storyRequest(library.Epoch, "story", 2, "third")
	changed.OperationID = "create-story"
	if _, err = reopened.Commit(ctx, changed); !errors.Is(err, ErrOperationID) {
		t.Fatalf("cross-kind receipt: %v", err)
	}
	if _, err = reopened.db.Exec(`UPDATE library_meta SET epoch='replacement'`); err != nil {
		t.Fatal(err)
	}
	if _, err = reopened.Commit(ctx, first); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("old receipt bypassed epoch: %v", err)
	}
	t.Log("two typed turns/four structured passages survive reopen; replay returns original V1 after V2; epoch fences receipts")
}
func TestStoryRejectsMalformedPayloadWithoutPartialWrites(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	cases := []struct {
		name   string
		change func(*CommitRequest)
		want   error
	}{
		{"old wire", func(r *CommitRequest) { r.SchemaVersion = 1 }, ErrInvalidRequest},
		{"wrong epoch", func(r *CommitRequest) { r.Epoch = "wrong" }, ErrWrongEpoch},
		{"empty epoch", func(r *CommitRequest) { r.Epoch = "" }, ErrInvalidRequest},
		{"negative version", func(r *CommitRequest) { r.ExpectedVersion = -1 }, ErrInvalidRequest},
		{"unsafe version", func(r *CommitRequest) { r.ExpectedVersion = 9007199254740991; r.Turn.Order = r.ExpectedVersion + 1 }, ErrInvalidRequest},
		{"wrong kind", func(r *CommitRequest) { r.Kind = "sql" }, ErrInvalidRequest},
		{"empty operation", func(r *CommitRequest) { r.OperationID = "" }, ErrInvalidRequest},
		{"bad adventure", func(r *CommitRequest) { r.AdventureID = "bad id" }, ErrInvalidRequest},
		{"missing adventure", func(r *CommitRequest) { r.AdventureID = "missing" }, ErrNotFound},
		{"turn schema", func(r *CommitRequest) { r.Turn.SchemaVersion = 2 }, ErrInvalidRequest},
		{"turn order", func(r *CommitRequest) { r.Turn.Order = 2 }, ErrInvalidRequest},
		{"turn id", func(r *CommitRequest) { r.Turn.ID = "" }, ErrInvalidRequest},
		{"missing passage", func(r *CommitRequest) { r.Turn.Passages = r.Turn.Passages[:1] }, ErrInvalidRequest},
		{"duplicate passage", func(r *CommitRequest) { r.Turn.Passages[1].ID = r.Turn.Passages[0].ID }, ErrInvalidRequest},
		{"bad source", func(r *CommitRequest) { r.Turn.Passages[0].Source = "generated" }, ErrInvalidRequest},
		{"body schema", func(r *CommitRequest) { r.Turn.Passages[0].Body.SchemaVersion = 2 }, ErrInvalidRequest},
		{"body type", func(r *CommitRequest) { r.Turn.Passages[0].Body.Type = "html" }, ErrInvalidRequest},
		{"blank body", func(r *CommitRequest) {
			r.Turn.Passages[0].Body = Document{1, "doc", []Paragraph{{"paragraph", []Inline{{"text", "  "}}}}}
		}, ErrInvalidRequest},
		{"missing content", func(r *CommitRequest) { r.Turn.Passages[0].Body.Content = nil }, ErrInvalidRequest},
		{"unknown node", func(r *CommitRequest) { r.Turn.Passages[0].Body.Content[0].Content[0].Type = "script" }, ErrInvalidRequest},
		{"hard break text", func(r *CommitRequest) { r.Turn.Passages[0].Body.Content[0].Content[1].Text = "hidden" }, ErrInvalidRequest},
		{"long body", func(r *CommitRequest) {
			r.Turn.Passages[0].Body.Content[0].Content[0].Text = strings.Repeat("x", 20001)
		}, ErrInvalidRequest},
		{"many paragraphs", func(r *CommitRequest) { r.Turn.Passages[0].Body.Content = make([]Paragraph, 1001) }, ErrInvalidRequest},
		{"many nodes", func(r *CommitRequest) {
			nodes := make([]Inline, 2001)
			for i := range nodes {
				nodes[i] = Inline{"text", "x"}
			}
			r.Turn.Passages[0].Body.Content = []Paragraph{{"paragraph", nodes}}
		}, ErrInvalidRequest},
		{"nil effects", func(r *CommitRequest) { r.Turn.Events = nil }, ErrInvalidRequest},
		{"unsupported effects", func(r *CommitRequest) {
			r.Turn.Events = []json.RawMessage{json.RawMessage(`{"schemaVersion":1,"type":"Set"}`)}
		}, ErrInvalidRequest},
	}
	before := readStory(t, s, library.Epoch, "story")
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := storyRequest(library.Epoch, "story", 0, "invalid")
			tc.change(&req)
			if _, err := s.Commit(ctx, req); !errors.Is(err, tc.want) {
				t.Fatalf("got %v want %v", err, tc.want)
			}
			if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
				t.Fatal("rejected payload changed canon")
			}
		})
	}
	req := storyRequest(library.Epoch, "story", 0, "valid")
	if _, err := s.Commit(ctx, req); err != nil {
		t.Fatal(err)
	}
	for _, duplicate := range []string{"turn", "passage"} {
		next := storyRequest(library.Epoch, "story", 1, "next")
		if duplicate == "turn" {
			next.Turn.ID = req.Turn.ID
		} else {
			next.Turn.Passages[0].ID = req.Turn.Passages[0].ID
		}
		if _, err := s.Commit(ctx, next); !errors.Is(err, ErrInvalidRequest) {
			t.Fatalf("existing %s: %v", duplicate, err)
		}
	}
}
func TestStoryRequestJSONRejectsUnknownAndMissingFields(t *testing.T) {
	encoded, _ := json.Marshal(storyRequest("epoch", "story", 0, "one"))
	var fields map[string]any
	json.Unmarshal(encoded, &fields)
	for _, field := range []string{"schemaVersion", "epoch", "operationId", "adventureId", "expectedVersion", "kind", "turn"} {
		t.Run(field, func(t *testing.T) {
			var copy map[string]any
			json.Unmarshal(encoded, &copy)
			delete(copy, field)
			bad, _ := json.Marshal(copy)
			var req CommitRequest
			if err := json.Unmarshal(bad, &req); err == nil {
				t.Fatal("missing field accepted")
			}
		})
	}
	fields["sql"] = "DROP TABLE adventures"
	bad, _ := json.Marshal(fields)
	var req CommitRequest
	if err := json.Unmarshal(bad, &req); err == nil {
		t.Fatal("unknown top-level field accepted")
	}
	bad = []byte(strings.Replace(string(encoded), `"type":"doc"`, `"unknown":true,"type":"doc"`, 1))
	if err := json.Unmarshal(bad, &req); err == nil {
		t.Fatal("unknown document field accepted")
	}
	if err := json.Unmarshal(encoded, &req); err != nil {
		t.Fatalf("valid request: %v", err)
	}
}
func TestStoryRollbackAndStorageFailureRecovery(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	req := storyRequest(library.Epoch, "story", 0, "one")
	before := readStory(t, s, library.Epoch, "story")
	if _, err := s.commit(ctx, req, true); err == nil {
		t.Fatal("injected failure expected")
	}
	if got := readStory(t, s, library.Epoch, "story"); !reflect.DeepEqual(got, before) {
		t.Fatal("transaction left partial data")
	}
	for _, table := range []string{"turns", "passages"} {
		var count int
		if err := s.db.QueryRow("SELECT count(*) FROM " + table).Scan(&count); err != nil || count != 0 {
			t.Fatalf("%s: %d %v", table, count, err)
		}
	}
	var count int
	if err := s.db.QueryRow(`SELECT count(*) FROM operations WHERE operation_id=?`, storyReceiptKey(req.AdventureID, req.OperationID)).Scan(&count); err != nil || count != 0 {
		t.Fatalf("failed receipt: %d %v", count, err)
	}
	cancelled, cancel := context.WithCancel(ctx)
	cancel()
	if _, err := s.Commit(cancelled, req); err == nil {
		t.Fatal("cancelled request saved")
	}
	if _, err := s.db.Exec(`PRAGMA query_only=ON`); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Commit(ctx, req); err == nil {
		t.Fatal("read-only write saved")
	}
	if _, err := s.db.Exec(`PRAGMA query_only=OFF`); err != nil {
		t.Fatal(err)
	}
	result, err := s.Commit(ctx, req)
	if err != nil || result.Replayed {
		t.Fatalf("recovery: %+v %v", result, err)
	}
}
func TestConcurrentStoryWritesAndCoherentReads(t *testing.T) {
	s, _, library := createStory(t)
	ctx := context.Background()
	var wg sync.WaitGroup
	errorsSeen := make(chan error, 20)
	successes := make(chan CommitResult, 20)
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			result, err := s.Commit(ctx, storyRequest(library.Epoch, "story", 0, fmt.Sprint(i)))
			if err != nil {
				errorsSeen <- err
			} else {
				successes <- result
			}
		}(i)
	}
	wg.Wait()
	close(errorsSeen)
	close(successes)
	if len(successes) != 1 {
		t.Fatalf("expected one winner, got %d", len(successes))
	}
	for err := range errorsSeen {
		if !errors.Is(err, ErrStaleVersion) {
			t.Fatal(err)
		}
	}
	// Race repeated coherent reads against new commits. Each version must contain
	// that exact number of complete, ordered two-passage turns.
	wg.Add(1)
	failures := make(chan error, 1)
	go func() {
		defer wg.Done()
		for n := int64(1); n < 15; n++ {
			if _, err := s.Commit(ctx, storyRequest(library.Epoch, "story", n, "race-"+fmt.Sprint(n))); err != nil {
				failures <- err
				return
			}
		}
	}()
	for i := 0; i < 30; i++ {
		snapshot := readStory(t, s, library.Epoch, "story")
		if int64(len(snapshot.Turns)) != snapshot.Adventure.Version {
			t.Fatalf("mixed snapshot: %+v", snapshot)
		}
		for j, turn := range snapshot.Turns {
			if turn.Order != int64(j+1) || len(turn.Passages) != 2 {
				t.Fatalf("partial turn: %+v", turn)
			}
		}
	}
	wg.Wait()
	close(failures)
	for err := range failures {
		t.Fatal(err)
	}
}
func TestUnknownStoredEventsPreserveReadableHistoryAndBlockAppend(t *testing.T) {
	s, _, library := createStory(t)
	req := storyRequest(library.Epoch, "story", 0, "one")
	if _, err := s.Commit(context.Background(), req); err != nil {
		t.Fatal(err)
	}
	unknown := `[{"schemaVersion":999,"domainOwner":"core","type":"future","payload":{"unknown":true}}]`
	if _, err := s.db.Exec(`UPDATE turns SET events=? WHERE adventure_id='story'`, unknown); err != nil {
		t.Fatal(err)
	}
	snapshot := readStory(t, s, library.Epoch, "story")
	if len(snapshot.Turns[0].Events) != 1 || !reflect.DeepEqual(snapshot.Turns[0].Passages, req.Turn.Passages) {
		t.Fatal("read lost unsupported events or readable prose")
	}
	if _, err := s.Commit(context.Background(), storyRequest(library.Epoch, "story", 1, "two")); !errors.Is(err, ErrUnsupportedHistory) {
		t.Fatalf("unsupported history append: %v", err)
	}
	if _, err := s.Commit(context.Background(), storyRequest(library.Epoch, "other", 0, "other")); err != nil {
		t.Fatalf("unrelated adventure blocked: %v", err)
	}
	var stored string
	if err := s.db.QueryRow(`SELECT events FROM turns WHERE adventure_id='story'`).Scan(&stored); err != nil || stored != unknown {
		t.Fatalf("unsupported data altered: %s %v", stored, err)
	}
}
func TestUpgradeBlankV1LibraryPreservesIdentityAndReceipts(t *testing.T) {
	path := filepath.Join(t.TempDir(), "legacy.db")
	db, err := sql.Open("sqlite", path)
	if err != nil {
		t.Fatal(err)
	}
	_, err = db.Exec(`CREATE TABLE library_meta(id INTEGER PRIMARY KEY CHECK(id=1),epoch TEXT NOT NULL);
 CREATE TABLE adventures(id TEXT PRIMARY KEY,title TEXT NOT NULL,version INTEGER NOT NULL CHECK(version>=0),baseline TEXT NOT NULL);
 CREATE TABLE operations(operation_id TEXT PRIMARY KEY,request_hash TEXT NOT NULL,result TEXT NOT NULL);
 INSERT INTO library_meta VALUES(1,'old-epoch');
 INSERT INTO adventures VALUES('old','Old adventure',0,'{"schemaVersion":1}');
 INSERT INTO operations VALUES('old-operation','original-hash','original-receipt');
 PRAGMA application_id=1280266821; PRAGMA user_version=1;`)
	db.Close()
	if err != nil {
		t.Fatal(err)
	}
	s, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer s.Close()
	snapshot := readStory(t, s, "old-epoch", "old")
	if snapshot.SchemaVersion != SchemaVersion || snapshot.Adventure.Title != "Old adventure" || snapshot.Adventure.Version != 0 || len(snapshot.Turns) != 0 || snapshot.Baseline.SchemaVersion != 1 {
		t.Fatalf("upgrade lost baseline: %+v", snapshot)
	}
	var hash, receipt string
	if err = s.db.QueryRow(`SELECT request_hash,result FROM operations WHERE operation_id='old-operation'`).Scan(&hash, &receipt); err != nil || hash != "original-hash" || receipt != "original-receipt" {
		t.Fatalf("receipt changed: %q %q %v", hash, receipt, err)
	}
	if _, err = s.Read(context.Background(), ReadRequest{1, "old-epoch", "old"}); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("old client not fenced: %v", err)
	}
	if _, err = s.Commit(context.Background(), storyRequest("old-epoch", "old", 0, "first")); err != nil {
		t.Fatalf("upgrade cannot continue: %v", err)
	}
}
func TestUpgradeFailureRollsBackSchema(t *testing.T) {
	s, path, _ := openLibrary(t)
	// Simulate a malformed v1 library with a conflicting table. Upgrade must not
	// partially add passages or bump its schema version.
	if _, err := s.db.Exec(`DROP TABLE passages; PRAGMA user_version=1`); err != nil {
		t.Fatal(err)
	}
	s.Close()
	if reopened, err := Open(path); err == nil {
		reopened.Close()
		t.Fatal("conflicting legacy table accepted")
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	var version, count int
	if err = db.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil || version != 1 {
		t.Fatalf("version changed: %d %v", version, err)
	}
	if err = db.QueryRow(`SELECT count(*) FROM sqlite_master WHERE name='passages'`).Scan(&count); err != nil || count != 0 {
		t.Fatalf("partial upgrade: %d %v", count, err)
	}
}

func TestStoryOperationIDsAreAdventureScoped(t *testing.T) {
	s, _, library := createStory(t)
	for _, id := range []string{"story", "other"} {
		req := storyRequest(library.Epoch, id, 0, "same")
		result, err := s.Commit(context.Background(), req)
		if err != nil || result.Replayed || result.AdventureID != id {
			t.Fatalf("%s: %+v %v", id, result, err)
		}
		replay, err := s.Commit(context.Background(), req)
		if err != nil || !replay.Replayed || replay.AdventureID != id {
			t.Fatalf("scoped replay %s: %+v %v", id, replay, err)
		}
		changed := req
		changed.Turn.ID = "altered"
		if _, err := s.Commit(context.Background(), changed); !errors.Is(err, ErrOperationID) {
			t.Fatalf("scoped misuse: %v", err)
		}
	}
}
