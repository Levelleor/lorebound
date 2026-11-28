package store

import (
	"context"
	"database/sql"
	json "encoding/json/v2"
	"errors"
	"strings"
	"unicode/utf8"
)

type LoreEntry struct {
	ID          string `json:"id"`
	Revision    int64  `json:"revision"`
	Kind        string `json:"kind"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Included    bool   `json:"included"`
}

type Lorebook struct {
	ReadRequest
	Entries []LoreEntry `json:"entries"`
}

type SaveLoreEntryRequest struct {
	ReadRequest
	Entry LoreEntry `json:"entry"`
}

func (r *SaveLoreEntryRequest) UnmarshalJSON(data []byte) error {
	var value struct {
		ReadRequest
		Entry struct {
			ID          string  `json:"id"`
			Revision    *int64  `json:"revision"`
			Kind        string  `json:"kind"`
			Title       string  `json:"title"`
			Description *string `json:"description"`
			Included    *bool   `json:"included"`
		} `json:"entry"`
	}
	if err := json.Unmarshal(data, &value, json.RejectUnknownMembers(true)); err != nil {
		return ErrInvalidRequest
	}
	entry := value.Entry
	if entry.Revision == nil || entry.Description == nil || entry.Included == nil {
		return ErrInvalidRequest
	}
	*r = SaveLoreEntryRequest{value.ReadRequest, LoreEntry{entry.ID, *entry.Revision, entry.Kind, entry.Title, *entry.Description, *entry.Included}}
	return nil
}

func (entry LoreEntry) valid() bool {
	switch entry.Kind {
	case "character", "place", "faction", "species", "object", "ability", "other":
	default:
		return false
	}
	return identifier.MatchString(entry.ID) && entry.Revision >= 0 && entry.Revision <= 9007199254740991 &&
		utf8.ValidString(entry.Title) && utf8.RuneCountInString(entry.Title) <= 160 &&
		strings.TrimSpace(entry.Title) != "" && !strings.ContainsAny(entry.Title, "\r\n") &&
		utf8.ValidString(entry.Description) && utf8.RuneCountInString(entry.Description) <= 4000
}

func addLorebook(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE lore_entries (
 adventure_id TEXT NOT NULL REFERENCES adventures(id) ON DELETE CASCADE,
 id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision>0), kind TEXT NOT NULL,
 title TEXT NOT NULL, description TEXT NOT NULL, included INTEGER NOT NULL CHECK(included IN (0,1)),
 PRIMARY KEY(adventure_id,id));
 PRAGMA user_version=10;`)
	return err
}

func lorebookTarget(ctx context.Context, tx *sql.Tx, req ReadRequest) error {
	if err := validateAdventureTarget(tx, req); err != nil {
		return err
	}
	var exists int
	err := tx.QueryRowContext(ctx, `SELECT 1 FROM adventures WHERE id=?`, req.AdventureID).Scan(&exists)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}
	return err
}

func (s *Store) ReadLorebook(ctx context.Context, req ReadRequest) (Lorebook, error) {
	result := Lorebook{ReadRequest: req, Entries: []LoreEntry{}}
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return result, err
	}
	defer tx.Rollback()
	if err := lorebookTarget(ctx, tx, req); err != nil {
		return result, err
	}
	rows, err := tx.QueryContext(ctx, `SELECT id,revision,kind,title,description,included FROM lore_entries WHERE adventure_id=? ORDER BY rowid`, req.AdventureID)
	if err != nil {
		return result, err
	}
	defer rows.Close()
	for rows.Next() {
		var entry LoreEntry
		if err := rows.Scan(&entry.ID, &entry.Revision, &entry.Kind, &entry.Title, &entry.Description, &entry.Included); err != nil {
			return result, err
		}
		if !entry.valid() || entry.Revision == 0 {
			return result, ErrUnsupportedLibrary
		}
		result.Entries = append(result.Entries, entry)
	}
	if err := rows.Err(); err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func (s *Store) SaveLoreEntry(ctx context.Context, req SaveLoreEntryRequest) (LoreEntry, error) {
	entry := req.Entry
	if !entry.valid() || entry.Revision == 9007199254740991 || (entry.Revision == 0 && entry.Included) {
		return LoreEntry{}, ErrInvalidRequest
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return LoreEntry{}, err
	}
	defer tx.Rollback()
	if err := lorebookTarget(ctx, tx, req.ReadRequest); err != nil {
		return LoreEntry{}, err
	}
	var current LoreEntry
	err = tx.QueryRowContext(ctx, `SELECT id,revision,kind,title,description,included FROM lore_entries WHERE adventure_id=? AND id=?`, req.AdventureID, entry.ID).
		Scan(&current.ID, &current.Revision, &current.Kind, &current.Title, &current.Description, &current.Included)
	next := entry
	next.Revision++
	switch {
	case errors.Is(err, sql.ErrNoRows):
		if entry.Revision != 0 {
			return LoreEntry{}, ErrStaleVersion
		}
		_, err = tx.ExecContext(ctx, `INSERT INTO lore_entries (adventure_id,id,revision,kind,title,description,included) VALUES (?,?,?,?,?,?,?)`, req.AdventureID, next.ID, next.Revision, next.Kind, next.Title, next.Description, next.Included)
	case err != nil:
		return LoreEntry{}, err
	case current == entry || current == next:
		return current, tx.Commit()
	case current.Revision != entry.Revision:
		return LoreEntry{}, ErrStaleVersion
	default:
		_, err = tx.ExecContext(ctx, `UPDATE lore_entries SET revision=?,kind=?,title=?,description=?,included=? WHERE adventure_id=? AND id=?`, next.Revision, next.Kind, next.Title, next.Description, next.Included, req.AdventureID, next.ID)
	}
	if err != nil {
		return LoreEntry{}, err
	}
	return next, tx.Commit()
}
