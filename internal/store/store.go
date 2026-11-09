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
	"os"
	"regexp"
	"strings"
	"unicode/utf8"

	_ "modernc.org/sqlite"
)

// Transport and storage versions are separate from the unchanged Turn-0 schema.
const SchemaVersion = 4
const databaseVersion = 6
const baselineVersion = 1
const applicationID = 0x4c4f5245

var identifier = regexp.MustCompile(`^[A-Za-z0-9_-]{1,80}$`)
var (
	ErrInvalidRequest     = errors.New("invalid_request")
	ErrWrongEpoch         = errors.New("wrong_epoch")
	ErrOperationID        = errors.New("operation_id_conflict")
	ErrAdventureExists    = errors.New("adventure_exists")
	ErrNotFound           = errors.New("adventure_not_found")
	ErrUnsupportedLibrary = errors.New("unsupported_library")
	ErrStaleVersion       = errors.New("stale_version")
	ErrUnsupportedHistory = errors.New("unsupported_history")
)

// Baseline is the canonical empty starting point, not a story passage or checkpoint.
// World-domain schemas are introduced only by their separately approved slices.
type Baseline struct {
	SchemaVersion int `json:"schemaVersion"`
}
type Adventure struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Version int64  `json:"version"`
}
type Snapshot struct {
	SchemaVersion int       `json:"schemaVersion"`
	Epoch         string    `json:"epoch"`
	Adventure     Adventure `json:"adventure"`
	Baseline      Baseline  `json:"baseline"`
	Turns         []Turn    `json:"turns"`
}
type Library struct {
	SchemaVersion int         `json:"schemaVersion"`
	Epoch         string      `json:"epoch"`
	Adventures    []Adventure `json:"adventures"`
}
type CreateRequest struct {
	SchemaVersion int      `json:"schemaVersion"`
	Epoch         string   `json:"epoch"`
	OperationID   string   `json:"operationId"`
	AdventureID   string   `json:"adventureId"`
	Title         string   `json:"title"`
	Baseline      Baseline `json:"baseline"`
}
type CreateResult struct {
	Snapshot Snapshot `json:"snapshot"`
	Replayed bool     `json:"replayed"`
}
type ReadRequest struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
	AdventureID   string `json:"adventureId"`
}

type Store struct{ db *sql.DB }

func Open(path string) (*Store, error) {
	// New libraries are private. Existing files are never overwritten or imported.
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0600)
	if err != nil {
		return nil, err
	}
	if err = file.Close(); err != nil {
		return nil, err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1)
	s := &Store{db: db}
	if err = s.initialize(); err != nil {
		db.Close()
		return nil, err
	}
	return s, nil
}

func (s *Store) initialize() error {
	if _, err := s.db.Exec(`PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;`); err != nil {
		return err
	}
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	var version, app, tables int
	if err = tx.QueryRow(`PRAGMA user_version`).Scan(&version); err != nil {
		return err
	}
	if err = tx.QueryRow(`PRAGMA application_id`).Scan(&app); err != nil {
		return err
	}
	if version == databaseVersion && app == applicationID {
		return tx.Commit()
	}
	if version == 1 && app == applicationID {
		if err = addStoryTables(tx); err != nil {
			return err
		}
		version = 2
	}
	if version == 2 && app == applicationID {
		if err = addDraftTable(tx); err != nil {
			return err
		}
		version = 3
	}
	if version == 3 && app == applicationID {
		// Fence older binaries that equate the concurrency version with turn count.
		if _, err = tx.Exec(`PRAGMA user_version = 4`); err != nil {
			return err
		}
		version = 4
	}
	if version == 4 && app == applicationID {
		// Fence binaries that require a generated passage in every stored turn.
		if _, err = tx.Exec(`PRAGMA user_version = 5`); err != nil {
			return err
		}
		version = 5
	}
	if version == 5 && app == applicationID {
		if err = addConnections(tx); err != nil {
			return err
		}
		return tx.Commit()
	}
	if err = tx.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`).Scan(&tables); err != nil {
		return err
	}
	if version != 0 || app != 0 || tables != 0 {
		return ErrUnsupportedLibrary
	}
	var identity [16]byte
	if _, err = rand.Read(identity[:]); err != nil {
		return err
	}
	if _, err = tx.Exec(`
 CREATE TABLE library_meta (id INTEGER PRIMARY KEY CHECK(id=1), epoch TEXT NOT NULL);
 CREATE TABLE adventures (id TEXT PRIMARY KEY, title TEXT NOT NULL, version INTEGER NOT NULL CHECK(version>=0), baseline TEXT NOT NULL);
 CREATE TABLE operations (operation_id TEXT PRIMARY KEY, request_hash TEXT NOT NULL, result TEXT NOT NULL);
 PRAGMA application_id = 1280266821;
 PRAGMA user_version = 1;`); err != nil {
		return err
	}
	if _, err = tx.Exec(`INSERT INTO library_meta VALUES (1, ?)`, hex.EncodeToString(identity[:])); err != nil {
		return err
	}
	if err = addStoryTables(tx); err != nil {
		return err
	}
	if err = addDraftTable(tx); err != nil {
		return err
	}
	if err = addConnections(tx); err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) Close() error { return s.db.Close() }

func epoch(tx *sql.Tx) (string, error) {
	var value string
	err := tx.QueryRow(`SELECT epoch FROM library_meta WHERE id=1`).Scan(&value)
	return value, err
}

func (s *Store) List(ctx context.Context) (Library, error) {
	result := Library{SchemaVersion: SchemaVersion, Adventures: []Adventure{}}
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return result, err
	}
	defer tx.Rollback()
	if result.Epoch, err = epoch(tx); err != nil {
		return result, err
	}
	rows, err := tx.QueryContext(ctx, `SELECT id, title, version FROM adventures ORDER BY rowid DESC`)
	if err != nil {
		return result, err
	}
	for rows.Next() {
		var item Adventure
		if err = rows.Scan(&item.ID, &item.Title, &item.Version); err != nil {
			rows.Close()
			return result, err
		}
		result.Adventures = append(result.Adventures, item)
	}
	err = rows.Err()
	rows.Close()
	if err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func (s *Store) Read(ctx context.Context, req ReadRequest) (Snapshot, error) {
	result := Snapshot{SchemaVersion: SchemaVersion, Turns: []Turn{}}
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" || !identifier.MatchString(req.AdventureID) {
		return result, ErrInvalidRequest
	}
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return result, err
	}
	defer tx.Rollback()
	if result.Epoch, err = epoch(tx); err != nil {
		return result, err
	}
	if req.Epoch != result.Epoch {
		return result, ErrWrongEpoch
	}
	if err = readHistory(ctx, tx, req.AdventureID, &result); err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func (s *Store) Create(ctx context.Context, req CreateRequest) (CreateResult, error) {
	return s.create(ctx, req, false)
}

func (s *Store) create(ctx context.Context, req CreateRequest, failAfterInsert bool) (CreateResult, error) {
	if req.SchemaVersion != SchemaVersion || req.Baseline.SchemaVersion != baselineVersion || req.Epoch == "" || !identifier.MatchString(req.AdventureID) || !identifier.MatchString(req.OperationID) || !utf8.ValidString(req.Title) || utf8.RuneCountInString(req.Title) > 160 || strings.TrimSpace(req.Title) == "" {
		return CreateResult{}, ErrInvalidRequest
	}
	encoded, err := json.Marshal(req)
	if err != nil {
		return CreateResult{}, err
	}
	fingerprint := fmt.Sprintf("create:%x", sha256.Sum256(encoded))
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return CreateResult{}, err
	}
	defer tx.Rollback()
	currentEpoch, err := epoch(tx)
	if err != nil {
		return CreateResult{}, err
	}
	// Validate the library before looking up receipts from a previous epoch.
	if req.Epoch != currentEpoch {
		return CreateResult{}, ErrWrongEpoch
	}
	var oldHash, receipt string
	err = tx.QueryRowContext(ctx, `SELECT request_hash, result FROM operations WHERE operation_id=?`, req.OperationID).Scan(&oldHash, &receipt)
	if err == nil {
		if oldHash != fingerprint {
			return CreateResult{}, ErrOperationID
		}
		var snapshot Snapshot
		if err = json.Unmarshal([]byte(receipt), &snapshot); err != nil {
			return CreateResult{}, err
		}
		return CreateResult{Snapshot: snapshot, Replayed: true}, nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return CreateResult{}, err
	}
	var exists int
	if err = tx.QueryRowContext(ctx, `SELECT count(*) FROM adventures WHERE id=?`, req.AdventureID).Scan(&exists); err != nil {
		return CreateResult{}, err
	}
	if exists != 0 {
		return CreateResult{}, ErrAdventureExists
	}
	baseline, err := json.Marshal(req.Baseline)
	if err != nil {
		return CreateResult{}, err
	}
	snapshot := Snapshot{SchemaVersion: SchemaVersion, Epoch: currentEpoch, Adventure: Adventure{ID: req.AdventureID, Title: req.Title, Version: 0}, Baseline: req.Baseline, Turns: []Turn{}}
	receiptBytes, err := json.Marshal(snapshot)
	if err != nil {
		return CreateResult{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO adventures(id,title,version,baseline) VALUES(?,?,0,?)`, req.AdventureID, req.Title, string(baseline)); err != nil {
		return CreateResult{}, err
	}
	if failAfterInsert {
		return CreateResult{}, errors.New("injected_transaction_failure")
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO operations VALUES(?,?,?)`, req.OperationID, fingerprint, string(receiptBytes)); err != nil {
		return CreateResult{}, err
	}
	if err = tx.Commit(); err != nil {
		return CreateResult{}, err
	}
	return CreateResult{Snapshot: snapshot}, nil
}
