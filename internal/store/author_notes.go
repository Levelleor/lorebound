package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"unicode/utf8"
)

var ErrAuthorNotesChanged = errors.New("author_notes_changed")

// Author notes are noncanonical creative guidance for one adventure.
// They are not passages, turns, drafts or world-state operations.
const authorNotesLimit = 4000

type AuthorNotes struct {
	ReadRequest
	Revision int64  `json:"revision"`
	Notes    string `json:"notes"`
}

type SaveAuthorNotesRequest struct {
	ReadRequest
	ExpectedRevision int64  `json:"expectedRevision"`
	Notes            string `json:"notes"`
}

func (r *SaveAuthorNotesRequest) UnmarshalJSON(data []byte) error {
	type plain SaveAuthorNotesRequest
	var value plain
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&value); err != nil {
		return ErrInvalidRequest
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil || len(fields) != 5 {
		return ErrInvalidRequest
	}
	for _, name := range []string{"schemaVersion", "epoch", "adventureId", "expectedRevision", "notes"} {
		if raw, ok := fields[name]; !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*r = SaveAuthorNotesRequest(value)
	return nil
}

func validAuthorNotes(notes string) bool {
	return utf8.ValidString(notes) && utf8.RuneCountInString(notes) <= authorNotesLimit
}

func addAuthorNotes(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE author_notes (
 adventure_id TEXT PRIMARY KEY REFERENCES adventures(id) ON DELETE CASCADE,
 revision INTEGER NOT NULL, notes TEXT NOT NULL);
 PRAGMA user_version=8;`)
	return err
}

func readAuthorNotes(ctx context.Context, tx *sql.Tx, req ReadRequest) (AuthorNotes, error) {
	result := AuthorNotes{ReadRequest: req}
	if !identifier.MatchString(req.AdventureID) {
		return result, ErrInvalidRequest
	}
	if err := connectionsEpoch(tx, ConnectionsRequest{req.SchemaVersion, req.Epoch}); err != nil {
		return result, err
	}
	var id string
	if err := tx.QueryRowContext(ctx, `SELECT id FROM adventures WHERE id=?`, req.AdventureID).Scan(&id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return result, ErrNotFound
		}
		return result, err
	}
	var notes string
	err := tx.QueryRowContext(ctx, `SELECT revision,notes FROM author_notes WHERE adventure_id=?`, req.AdventureID).Scan(&result.Revision, &notes)
	if errors.Is(err, sql.ErrNoRows) {
		return result, nil
	}
	if err != nil {
		return result, err
	}
	if !validAuthorNotes(notes) || result.Revision < 1 || result.Revision > 9007199254740991 {
		return result, ErrUnsupportedLibrary
	}
	result.Notes = notes
	return result, nil
}

func (s *Store) ReadAuthorNotes(ctx context.Context, req ReadRequest) (AuthorNotes, error) {
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return AuthorNotes{}, err
	}
	defer tx.Rollback()
	result, err := readAuthorNotes(ctx, tx, req)
	if err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func (s *Store) SaveAuthorNotes(ctx context.Context, req SaveAuthorNotesRequest) (AuthorNotes, error) {
	if req.ExpectedRevision < 0 || req.ExpectedRevision >= 9007199254740991 || !validAuthorNotes(req.Notes) {
		return AuthorNotes{}, ErrInvalidRequest
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return AuthorNotes{}, err
	}
	defer tx.Rollback()
	current, err := readAuthorNotes(ctx, tx, req.ReadRequest)
	if err != nil {
		return current, err
	}
	// Resolve an uncertain save without creating a revision or overwriting a newer value.
	if current.Notes == req.Notes {
		return current, tx.Commit()
	}
	if current.Revision != req.ExpectedRevision {
		return current, ErrAuthorNotesChanged
	}
	if _, err := tx.ExecContext(ctx, `INSERT INTO author_notes VALUES(?,?,?)
 ON CONFLICT(adventure_id) DO UPDATE SET revision=excluded.revision,notes=excluded.notes`, req.AdventureID, current.Revision+1, req.Notes); err != nil {
		return current, err
	}
	current.Revision++
	current.Notes = req.Notes
	return current, tx.Commit()
}
