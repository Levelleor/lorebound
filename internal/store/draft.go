package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"unicode/utf8"
)

// Draft targets are separate from accepted passages and operation receipts.
type DraftRequest struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
	AdventureID   string `json:"adventureId"`
	Target        string `json:"target"`
}
type SaveDraftRequest struct {
	DraftRequest
	Text string `json:"text"`
}
type Draft struct {
	DraftRequest
	Text string `json:"text"`
}

func (r *SaveDraftRequest) UnmarshalJSON(data []byte) error {
	type plain SaveDraftRequest
	var value plain
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&value); err != nil {
		return ErrInvalidRequest
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return ErrInvalidRequest
	}
	if raw, ok := fields["text"]; !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
		return ErrInvalidRequest
	}
	*r = SaveDraftRequest(value)
	return nil
}

func addDraftTable(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE drafts (
 adventure_id TEXT NOT NULL REFERENCES adventures(id) ON DELETE CASCADE,
 target TEXT NOT NULL, text TEXT NOT NULL,
 PRIMARY KEY(adventure_id,target));
 PRAGMA user_version = 3;`)
	return err
}

func draftTransaction(ctx context.Context, tx *sql.Tx, req DraftRequest) error {
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" || !identifier.MatchString(req.AdventureID) || req.Target != "composer_story" {
		return ErrInvalidRequest
	}
	currentEpoch, err := epoch(tx)
	if err != nil {
		return err
	}
	if currentEpoch != req.Epoch {
		return ErrWrongEpoch
	}
	var id string
	err = tx.QueryRowContext(ctx, `SELECT id FROM adventures WHERE id=?`, req.AdventureID).Scan(&id)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}
	return err
}

func (s *Store) ReadDraft(ctx context.Context, req DraftRequest) (Draft, error) {
	result := Draft{DraftRequest: req}
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return Draft{}, err
	}
	defer tx.Rollback()
	if err = draftTransaction(ctx, tx, req); err != nil {
		return Draft{}, err
	}
	err = tx.QueryRowContext(ctx, `SELECT text FROM drafts WHERE adventure_id=? AND target=?`, req.AdventureID, req.Target).Scan(&result.Text)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return Draft{}, err
	}
	return result, tx.Commit()
}

func (s *Store) SaveDraft(ctx context.Context, req SaveDraftRequest) (Draft, error) {
	if !utf8.ValidString(req.Text) || utf8.RuneCountInString(req.Text) > 20000 {
		return Draft{}, ErrInvalidRequest
	}
	text := strings.ReplaceAll(strings.ReplaceAll(req.Text, "\r\n", "\n"), "\r", "\n")
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return Draft{}, err
	}
	defer tx.Rollback()
	if err = draftTransaction(ctx, tx, req.DraftRequest); err != nil {
		return Draft{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO drafts VALUES(?,?,?) ON CONFLICT(adventure_id,target) DO UPDATE SET text=excluded.text`, req.AdventureID, req.Target, text); err != nil {
		return Draft{}, err
	}
	return Draft{DraftRequest: req.DraftRequest, Text: text}, tx.Commit()
}

func documentText(doc Document) string {
	paragraphs := make([]string, len(doc.Content))
	for i, paragraph := range doc.Content {
		var text strings.Builder
		for _, node := range paragraph.Content {
			if node.Type == "hard_break" {
				text.WriteByte('\n')
			} else {
				text.WriteString(node.Text)
			}
		}
		paragraphs[i] = text.String()
	}
	return strings.Join(paragraphs, "\n\n")
}
