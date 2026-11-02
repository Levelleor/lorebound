package store

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"

	_ "modernc.org/sqlite"
)

const SchemaVersion = 1

var operationIDPattern = regexp.MustCompile(`^[A-Za-z0-9_-]{1,80}$`)

var (
	ErrInvalidRequest = errors.New("invalid_request")
	ErrWrongEpoch     = errors.New("wrong_epoch")
	ErrStaleVersion   = errors.New("stale_version")
	ErrOperationID    = errors.New("operation_id_conflict")
)

// This small technical record is a Gate 0 contract, not a story schema.
type State struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
	Version       int64  `json:"version"`
	Value         string `json:"value"`
}

type CommitRequest struct {
	SchemaVersion   int    `json:"schemaVersion"`
	Epoch           string `json:"epoch"`
	ExpectedVersion int64  `json:"expectedVersion"`
	OperationID     string `json:"operationId"`
	Value           string `json:"value"`
}

type CommitResult struct {
	State    State `json:"state"`
	Replayed bool  `json:"replayed"`
}

type Store struct{ db *sql.DB }

func Open(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	// One connection serializes writes across tabs and keeps connection pragmas stable.
	db.SetMaxOpenConns(1)
	if _, err = db.Exec(`PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;
		CREATE TABLE IF NOT EXISTS gate_meta (id INTEGER PRIMARY KEY CHECK(id = 1), epoch TEXT NOT NULL, version INTEGER NOT NULL, value TEXT NOT NULL);
		CREATE TABLE IF NOT EXISTS gate_operations (operation_id TEXT PRIMARY KEY, request_hash TEXT NOT NULL, resulting_version INTEGER NOT NULL, resulting_value TEXT NOT NULL);`); err != nil {
		db.Close()
		return nil, fmt.Errorf("initialize gate database: %w", err)
	}
	var count int
	if err = db.QueryRow(`SELECT count(*) FROM gate_meta`).Scan(&count); err != nil {
		db.Close()
		return nil, err
	}
	if count == 0 {
		var identity [16]byte
		if _, err = rand.Read(identity[:]); err != nil {
			db.Close()
			return nil, err
		}
		if _, err = db.Exec(`INSERT INTO gate_meta(id, epoch, version, value) VALUES(1, ?, 0, '')`, hex.EncodeToString(identity[:])); err != nil {
			db.Close()
			return nil, err
		}
	}
	return &Store{db: db}, nil
}

func (s *Store) Close() error { return s.db.Close() }

func (s *Store) Read(ctx context.Context) (State, error) {
	state := State{SchemaVersion: SchemaVersion}
	err := s.db.QueryRowContext(ctx, `SELECT epoch, version, value FROM gate_meta WHERE id = 1`).Scan(&state.Epoch, &state.Version, &state.Value)
	return state, err
}

func (s *Store) Commit(ctx context.Context, req CommitRequest) (CommitResult, error) {
	return s.commit(ctx, req, false)
}

func (s *Store) commit(ctx context.Context, req CommitRequest, failAfterWrite bool) (CommitResult, error) {
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" || req.ExpectedVersion < 0 || !operationIDPattern.MatchString(req.OperationID) || len(req.Value) > 1024 {
		return CommitResult{}, ErrInvalidRequest
	}
	encoded, err := json.Marshal(req)
	if err != nil {
		return CommitResult{}, err
	}
	hash := fmt.Sprintf("%x", sha256.Sum256(encoded))
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return CommitResult{}, err
	}
	defer tx.Rollback()
	var previousHash string
	var previousVersion int64
	var previousValue string
	err = tx.QueryRowContext(ctx, `SELECT request_hash, resulting_version, resulting_value FROM gate_operations WHERE operation_id = ?`, req.OperationID).Scan(&previousHash, &previousVersion, &previousValue)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return CommitResult{}, err
	}
	duplicate := err == nil
	state := State{SchemaVersion: SchemaVersion}
	if err = tx.QueryRowContext(ctx, `SELECT epoch, version, value FROM gate_meta WHERE id = 1`).Scan(&state.Epoch, &state.Version, &state.Value); err != nil {
		return CommitResult{}, err
	}
	if duplicate {
		if previousHash != hash {
			return CommitResult{}, ErrOperationID
		}
		state.Version = previousVersion
		state.Value = previousValue
		return CommitResult{State: state, Replayed: true}, nil
	}
	if req.Epoch != state.Epoch {
		return CommitResult{}, ErrWrongEpoch
	}
	if req.ExpectedVersion != state.Version {
		return CommitResult{}, ErrStaleVersion
	}
	if _, err = tx.ExecContext(ctx, `UPDATE gate_meta SET version = version + 1, value = ? WHERE id = 1`, req.Value); err != nil {
		return CommitResult{}, err
	}
	if failAfterWrite {
		return CommitResult{}, errors.New("injected_transaction_failure")
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO gate_operations(operation_id, request_hash, resulting_version, resulting_value) VALUES(?, ?, ?, ?)`, req.OperationID, hash, state.Version+1, req.Value); err != nil {
		return CommitResult{}, err
	}
	if err = tx.Commit(); err != nil {
		return CommitResult{}, err
	}
	state.Version++
	state.Value = req.Value
	return CommitResult{State: state}, nil
}
