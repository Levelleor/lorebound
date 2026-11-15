package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"unicode/utf8"
)

var ErrNarrationChanged = errors.New("narration_settings_changed")

type NarrationStyle struct {
	Perspective  string `json:"perspective"`
	Tense        string `json:"tense"`
	Genre        string `json:"genre"`
	Tone         string `json:"tone"`
	Pacing       string `json:"pacing"`
	Length       string `json:"length"`
	Instructions string `json:"instructions"`
}

type NarrationSettings struct {
	ReadRequest
	Revision int64          `json:"revision"`
	Style    NarrationStyle `json:"style"`
}

type SaveNarrationRequest struct {
	ReadRequest
	ExpectedRevision int64          `json:"expectedRevision"`
	Style            NarrationStyle `json:"style"`
}

func (s *NarrationStyle) UnmarshalJSON(data []byte) error {
	type plain NarrationStyle
	var value plain
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&value); err != nil {
		return ErrInvalidRequest
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil || len(fields) != 7 {
		return ErrInvalidRequest
	}
	for _, raw := range fields {
		if bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*s = NarrationStyle(value)
	return nil
}

func (r *SaveNarrationRequest) UnmarshalJSON(data []byte) error {
	type plain SaveNarrationRequest
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
	for _, name := range []string{"schemaVersion", "epoch", "adventureId", "expectedRevision", "style"} {
		if raw, ok := fields[name]; !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*r = SaveNarrationRequest(value)
	return nil
}

func validNarration(style NarrationStyle) bool {
	return (style.Perspective == "" || style.Perspective == "first" || style.Perspective == "second" || style.Perspective == "third") &&
		(style.Tense == "" || style.Tense == "past" || style.Tense == "present") &&
		(style.Pacing == "" || style.Pacing == "slow" || style.Pacing == "balanced" || style.Pacing == "fast") &&
		(style.Length == "" || style.Length == "brief" || style.Length == "balanced" || style.Length == "detailed") &&
		utf8.ValidString(style.Genre) && utf8.RuneCountInString(style.Genre) <= 200 &&
		utf8.ValidString(style.Tone) && utf8.RuneCountInString(style.Tone) <= 200 &&
		utf8.ValidString(style.Instructions) && utf8.RuneCountInString(style.Instructions) <= 2000
}

func addNarration(tx *sql.Tx) error {
	_, err := tx.Exec(`CREATE TABLE narration_settings (
 adventure_id TEXT PRIMARY KEY REFERENCES adventures(id) ON DELETE CASCADE,
 revision INTEGER NOT NULL, style TEXT NOT NULL);
 PRAGMA user_version=7;`)
	return err
}

func readNarration(ctx context.Context, tx *sql.Tx, req ReadRequest) (NarrationSettings, error) {
	result := NarrationSettings{ReadRequest: req}
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
	var encoded string
	err := tx.QueryRowContext(ctx, `SELECT revision,style FROM narration_settings WHERE adventure_id=?`, req.AdventureID).Scan(&result.Revision, &encoded)
	if errors.Is(err, sql.ErrNoRows) {
		return result, nil
	}
	if err != nil {
		return result, err
	}
	if err := json.Unmarshal([]byte(encoded), &result.Style); err != nil || !validNarration(result.Style) || result.Revision < 1 || result.Revision > 9007199254740991 {
		return result, ErrUnsupportedLibrary
	}
	return result, nil
}

func (s *Store) ReadNarration(ctx context.Context, req ReadRequest) (NarrationSettings, error) {
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
	if err != nil {
		return NarrationSettings{}, err
	}
	defer tx.Rollback()
	result, err := readNarration(ctx, tx, req)
	if err != nil {
		return result, err
	}
	return result, tx.Commit()
}

func (s *Store) SaveNarration(ctx context.Context, req SaveNarrationRequest) (NarrationSettings, error) {
	if req.ExpectedRevision < 0 || req.ExpectedRevision >= 9007199254740991 || !validNarration(req.Style) {
		return NarrationSettings{}, ErrInvalidRequest
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return NarrationSettings{}, err
	}
	defer tx.Rollback()
	current, err := readNarration(ctx, tx, req.ReadRequest)
	if err != nil {
		return current, err
	}
	// Resolve an uncertain save without creating a revision or overwriting a newer value.
	if current.Style == req.Style {
		return current, tx.Commit()
	}
	if current.Revision != req.ExpectedRevision {
		return current, ErrNarrationChanged
	}
	encoded, err := json.Marshal(req.Style)
	if err != nil {
		return current, err
	}
	if _, err := tx.ExecContext(ctx, `INSERT INTO narration_settings VALUES(?,?,?)
 ON CONFLICT(adventure_id) DO UPDATE SET revision=excluded.revision,style=excluded.style`, req.AdventureID, current.Revision+1, string(encoded)); err != nil {
		return current, err
	}
	current.Revision++
	current.Style = req.Style
	return current, tx.Commit()
}
