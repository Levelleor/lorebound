package store

import (
	"context"
	"database/sql"
	json "encoding/json/v2"
	"errors"
	"unicode/utf8"
)

// Author notes are noncanonical creative guidance for one adventure.
// They are not passages, turns, drafts or world-state operations.
const authorNotesLimit = 4000

type AuthorNotes struct {
	ReadRequest
	Notes string `json:"notes"`
}

type SaveAuthorNotesRequest AuthorNotes

func (r *SaveAuthorNotesRequest) UnmarshalJSON(data []byte) error {
	var value struct {
		SchemaVersion *int    `json:"schemaVersion"`
		Epoch         *string `json:"epoch"`
		AdventureID   *string `json:"adventureId"`
		Notes         *string `json:"notes"`
	}
	// The strict decoder rejects malformed UTF-8 and unpaired JSON surrogates.
	if err := json.Unmarshal(data, &value, json.RejectUnknownMembers(true)); err != nil {
		return ErrInvalidRequest
	}
	if value.SchemaVersion == nil || value.Epoch == nil || value.AdventureID == nil || value.Notes == nil {
		return ErrInvalidRequest
	}
	*r = SaveAuthorNotesRequest{
		ReadRequest: ReadRequest{*value.SchemaVersion, *value.Epoch, *value.AdventureID},
		Notes:       *value.Notes,
	}
	return nil
}

func validAuthorNotes(notes string) bool {
	return utf8.ValidString(notes) && utf8.RuneCountInString(notes) <= authorNotesLimit
}

func addAuthorNotes(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE author_notes (
 adventure_id TEXT PRIMARY KEY REFERENCES adventures(id) ON DELETE CASCADE,
 notes TEXT NOT NULL);
 PRAGMA user_version=9;`)
	return err
}

func (s *Store) ReadAuthorNotes(ctx context.Context, req ReadRequest) (AuthorNotes, error) {
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return AuthorNotes{}, err
	}
	defer tx.Rollback()
	if err := validateAdventureTarget(tx, req); err != nil {
		return AuthorNotes{}, err
	}
	result := AuthorNotes{ReadRequest: req}
	err = tx.QueryRowContext(ctx, `SELECT COALESCE(n.notes, '') FROM adventures a
 LEFT JOIN author_notes n ON n.adventure_id=a.id WHERE a.id=?`, req.AdventureID).Scan(&result.Notes)
	if errors.Is(err, sql.ErrNoRows) {
		return AuthorNotes{}, ErrNotFound
	}
	if err != nil {
		return AuthorNotes{}, err
	}
	if !validAuthorNotes(result.Notes) {
		return AuthorNotes{}, ErrUnsupportedLibrary
	}
	return result, tx.Commit()
}

func (s *Store) SaveAuthorNotes(ctx context.Context, req SaveAuthorNotesRequest) (AuthorNotes, error) {
	if !validAuthorNotes(req.Notes) {
		return AuthorNotes{}, ErrInvalidRequest
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return AuthorNotes{}, err
	}
	defer tx.Rollback()
	if err := validateAdventureTarget(tx, req.ReadRequest); err != nil {
		return AuthorNotes{}, err
	}
	write, err := tx.ExecContext(ctx, `INSERT INTO author_notes (adventure_id, notes)
 SELECT id, ? FROM adventures WHERE id=?
 ON CONFLICT(adventure_id) DO UPDATE SET notes=excluded.notes`, req.Notes, req.AdventureID)
	if err != nil {
		return AuthorNotes{}, err
	}
	rows, err := write.RowsAffected()
	if err != nil {
		return AuthorNotes{}, err
	}
	if rows == 0 {
		return AuthorNotes{}, ErrNotFound
	}
	return AuthorNotes(req), tx.Commit()
}
