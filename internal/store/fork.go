package store

import (
	"bytes"
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"unicode/utf8"
)

type ForkRequest struct {
	SchemaVersion     int    `json:"schemaVersion"`
	Epoch             string `json:"epoch"`
	OperationID       string `json:"operationId"`
	SourceAdventureID string `json:"sourceAdventureId"`
	ExpectedVersion   int64  `json:"expectedVersion"`
	TurnID            string `json:"turnId"`
	AdventureID       string `json:"adventureId"`
	Title             string `json:"title"`
}

// A receipt identifies the copied boundary without retaining another prose archive.
type ForkResult struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
	OperationID   string `json:"operationId"`
	AdventureID   string `json:"adventureId"`
	Version       int64  `json:"version"`
	TurnID        string `json:"turnId"`
	Replayed      bool   `json:"replayed"`
}

func (r *ForkRequest) UnmarshalJSON(data []byte) error {
	type plain ForkRequest
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
	for _, field := range []string{"schemaVersion", "epoch", "operationId", "sourceAdventureId", "expectedVersion", "turnId", "adventureId", "title"} {
		raw, ok := fields[field]
		if !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*r = ForkRequest(value)
	return nil
}

func (s *Store) Fork(ctx context.Context, req ForkRequest) (ForkResult, error) {
	return s.fork(ctx, req, false)
}

func (s *Store) fork(ctx context.Context, req ForkRequest, failBeforeReceipt bool) (ForkResult, error) {
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" || !identifier.MatchString(req.OperationID) || !identifier.MatchString(req.SourceAdventureID) || !identifier.MatchString(req.AdventureID) || req.AdventureID == req.SourceAdventureID || !identifier.MatchString(req.TurnID) || req.ExpectedVersion < 1 || req.ExpectedVersion > 9007199254740991 || !utf8.ValidString(req.Title) || utf8.RuneCountInString(req.Title) > 160 || strings.TrimSpace(req.Title) == "" {
		return ForkResult{}, ErrInvalidRequest
	}
	encoded, err := json.Marshal(req)
	if err != nil {
		return ForkResult{}, err
	}
	fingerprint := fmt.Sprintf("fork:%x", sha256.Sum256(encoded))
	key := storyReceiptKey(req.SourceAdventureID, req.OperationID)
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return ForkResult{}, err
	}
	defer tx.Rollback()
	currentEpoch, err := epoch(tx)
	if err != nil {
		return ForkResult{}, err
	}
	if req.Epoch != currentEpoch {
		return ForkResult{}, ErrWrongEpoch
	}
	var oldHash, receipt string
	err = tx.QueryRowContext(ctx, `SELECT request_hash,result FROM operations WHERE operation_id=?`, key).Scan(&oldHash, &receipt)
	if err == nil {
		if oldHash != fingerprint {
			return ForkResult{}, ErrOperationID
		}
		var result ForkResult
		if err = json.Unmarshal([]byte(receipt), &result); err != nil {
			return ForkResult{}, err
		}
		result.Replayed = true
		return result, nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return ForkResult{}, err
	}
	var creationReceipt string
	err = tx.QueryRowContext(ctx, `SELECT result FROM operations WHERE operation_id=?`, req.OperationID).Scan(&creationReceipt)
	if err == nil {
		var created Snapshot
		if err = json.Unmarshal([]byte(creationReceipt), &created); err != nil {
			return ForkResult{}, err
		}
		if created.Adventure.ID == req.SourceAdventureID {
			return ForkResult{}, ErrOperationID
		}
	} else if !errors.Is(err, sql.ErrNoRows) {
		return ForkResult{}, err
	}
	source := Snapshot{SchemaVersion: SchemaVersion, Epoch: currentEpoch}
	if err = readHistory(ctx, tx, req.SourceAdventureID, &source); err != nil {
		return ForkResult{}, err
	}
	if source.Adventure.Version != req.ExpectedVersion {
		return ForkResult{}, ErrStaleVersion
	}
	if int64(len(source.Turns)) != source.Adventure.Version {
		return ForkResult{}, ErrUnsupportedHistory
	}
	boundary := int64(0)
	ids := map[string]bool{}
	for i, turn := range source.Turns {
		if !validTurn(turn) || turn.Order != int64(i+1) {
			return ForkResult{}, ErrUnsupportedHistory
		}
		for _, id := range []string{turn.ID, turn.Passages[0].ID, turn.Passages[1].ID} {
			if ids[id] {
				return ForkResult{}, ErrUnsupportedHistory
			}
			ids[id] = true
		}
		if turn.ID == req.TurnID {
			boundary = turn.Order
		}
	}
	if boundary == 0 {
		return ForkResult{}, ErrInvalidRequest
	}
	var exists int
	if err = tx.QueryRowContext(ctx, `SELECT count(*) FROM adventures WHERE id=?`, req.AdventureID).Scan(&exists); err != nil {
		return ForkResult{}, err
	}
	if exists != 0 {
		return ForkResult{}, ErrAdventureExists
	}
	// Copy independent rows; logical IDs remain stable within adventure scope.
	if _, err = tx.ExecContext(ctx, `INSERT INTO adventures(id,title,version,baseline) SELECT ?,?,?,baseline FROM adventures WHERE id=?`, req.AdventureID, req.Title, boundary, req.SourceAdventureID); err != nil {
		return ForkResult{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO turns SELECT ?,id,sequence,schema_version,events FROM turns WHERE adventure_id=? AND sequence<=?`, req.AdventureID, req.SourceAdventureID, boundary); err != nil {
		return ForkResult{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO passages SELECT ?,p.id,p.turn_id,p.ordinal,p.source,p.body FROM passages p JOIN turns t ON t.adventure_id=p.adventure_id AND t.id=p.turn_id WHERE p.adventure_id=? AND t.sequence<=?`, req.AdventureID, req.SourceAdventureID, boundary); err != nil {
		return ForkResult{}, err
	}
	if failBeforeReceipt {
		return ForkResult{}, errors.New("injected_transaction_failure")
	}
	result := ForkResult{SchemaVersion: SchemaVersion, Epoch: currentEpoch, OperationID: req.OperationID, AdventureID: req.AdventureID, Version: boundary, TurnID: req.TurnID}
	receiptBytes, err := json.Marshal(result)
	if err != nil {
		return ForkResult{}, err
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO operations VALUES(?,?,?)`, key, fingerprint, string(receiptBytes)); err != nil {
		return ForkResult{}, err
	}
	if err = tx.Commit(); err != nil {
		return ForkResult{}, err
	}
	return result, nil
}
