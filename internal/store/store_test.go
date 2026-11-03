package store

import (
	"context"
	"errors"
	"path/filepath"
	"testing"
)

func TestRealSQLiteContract(t *testing.T) {
	path := filepath.Join(t.TempDir(), "gate0.db")
	s, err := Open(path)
	if err != nil {
		t.Fatal(err)
	}
	var sqliteVersion string
	if err := s.db.QueryRow(`SELECT sqlite_version()`).Scan(&sqliteVersion); err != nil {
		t.Fatal(err)
	}
	t.Logf("SQLite engine: %s", sqliteVersion)
	ctx := context.Background()
	initial, err := s.Read(ctx)
	if err != nil {
		t.Fatal(err)
	}
	invalid := CommitRequest{SchemaVersion: 2, Epoch: initial.Epoch, ExpectedVersion: 0, OperationID: "bad id", Value: "invalid"}
	if _, err = s.Commit(ctx, invalid); !errors.Is(err, ErrInvalidRequest) {
		t.Fatalf("invalid input: %v", err)
	}
	req := CommitRequest{SchemaVersion: 1, Epoch: initial.Epoch, ExpectedVersion: 0, OperationID: "first", Value: "committed"}
	result, err := s.Commit(ctx, req)
	if err != nil || result.State.Version != 1 || result.State.Value != "committed" {
		t.Fatalf("commit: %+v %v", result, err)
	}
	t.Logf("commit/readback: version=%d value=%q", result.State.Version, result.State.Value)
	read, err := s.Read(ctx)
	if err != nil || read != result.State {
		t.Fatalf("readback: %+v %v", read, err)
	}
	if replay, err := s.Commit(ctx, req); err != nil || !replay.Replayed || replay.State.Version != 1 {
		t.Fatalf("idempotency: %+v %v", replay, err)
	}
	t.Log("duplicate operation: replayed without version increment")
	wrong := req
	wrong.Value = "changed"
	if _, err = s.Commit(ctx, wrong); !errors.Is(err, ErrOperationID) {
		t.Fatalf("operation ID reuse: %v", err)
	}
	t.Logf("operation ID reuse rejected: %v", err)
	stale := req
	stale.OperationID = "stale"
	if _, err = s.Commit(ctx, stale); !errors.Is(err, ErrStaleVersion) {
		t.Fatalf("stale version: %v", err)
	}
	t.Logf("stale version rejected: %v", err)
	otherEpoch := req
	otherEpoch.OperationID = "epoch"
	otherEpoch.Epoch = "other"
	otherEpoch.ExpectedVersion = 1
	if _, err = s.Commit(ctx, otherEpoch); !errors.Is(err, ErrWrongEpoch) {
		t.Fatalf("epoch: %v", err)
	}
	t.Logf("wrong epoch rejected: %v", err)
	failed := req
	failed.OperationID = "rollback"
	failed.ExpectedVersion = 1
	failed.Value = "must-not-save"
	if _, err = s.commit(ctx, failed, true); err == nil {
		t.Fatal("expected injected failure")
	}
	read, err = s.Read(ctx)
	if err != nil || read.Version != 1 || read.Value != "committed" {
		t.Fatalf("rollback: %+v %v", read, err)
	}
	t.Logf("rollback: version=%d value=%q", read.Version, read.Value)
	if err = s.Close(); err != nil {
		t.Fatal(err)
	}
	s, err = Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer s.Close()
	read, err = s.Read(ctx)
	if err != nil || read.Version != 1 || read.Value != "committed" || read.Epoch != initial.Epoch {
		t.Fatalf("reopen: %+v %v", read, err)
	}
	t.Logf("reopen: epoch=%s version=%d value=%q", read.Epoch, read.Version, read.Value)
	second := req
	second.OperationID = "second"
	second.ExpectedVersion = 1
	second.Value = "newer"
	if _, err = s.Commit(ctx, second); err != nil {
		t.Fatal(err)
	}
	if replay, err := s.Commit(ctx, req); err != nil || !replay.Replayed || replay.State.Version != 1 || replay.State.Value != "committed" {
		t.Fatalf("original idempotent result after later commit: %+v %v", replay, err)
	}
}
