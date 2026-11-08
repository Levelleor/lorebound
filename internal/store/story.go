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

// These are technical serialization contracts, not a Go story reducer.
type Inline struct {
	Type string `json:"type"`
	Text string `json:"text,omitempty"`
}
type Paragraph struct {
	Type    string   `json:"type"`
	Content []Inline `json:"content"`
}
type Document struct {
	SchemaVersion int         `json:"schemaVersion"`
	Type          string      `json:"type"`
	Content       []Paragraph `json:"content"`
}
type Passage struct {
	ID     string   `json:"id"`
	Source string   `json:"source"`
	Body   Document `json:"body"`
}
type Turn struct {
	SchemaVersion int       `json:"schemaVersion"`
	ID            string    `json:"id"`
	Order         int64     `json:"order"`
	Passages      []Passage `json:"passages"`
	// This slice supports no world effects. Preserve unknown stored envelopes for
	// browser fail-closed diagnostics/read-only prose; never silently drop them.
	Events []json.RawMessage `json:"events"`
}
type CommitRequest struct {
	SchemaVersion   int       `json:"schemaVersion"`
	Epoch           string    `json:"epoch"`
	OperationID     string    `json:"operationId"`
	AdventureID     string    `json:"adventureId"`
	ExpectedVersion int64     `json:"expectedVersion"`
	Kind            string    `json:"kind"`
	Turn            Turn      `json:"turn,omitzero"`
	TurnID          string    `json:"turnId,omitempty"`
	PassageID       string    `json:"passageId,omitempty"`
	Body            *Document `json:"body,omitempty"`
	Later           string    `json:"later,omitempty"`
}
type CommitResult struct {
	SchemaVersion int    `json:"schemaVersion"`
	Epoch         string `json:"epoch"`
	AdventureID   string `json:"adventureId"`
	OperationID   string `json:"operationId"`
	Version       int64  `json:"version"`
	TurnID        string `json:"turnId"`
	Replayed      bool   `json:"replayed"`
}

func (node *Inline) UnmarshalJSON(data []byte) error {
	type plain Inline
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
	if value.Type == "hard_break" && len(fields) != 1 {
		return ErrInvalidRequest
	}
	*node = Inline(value)
	return nil
}

// Reject fields that this version cannot represent rather than silently stripping
// data before fingerprinting. In particular expectedVersion:0 must be explicit.
func (r *CommitRequest) UnmarshalJSON(data []byte) error {
	type plain CommitRequest
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
	required := []string{"schemaVersion", "epoch", "operationId", "adventureId", "expectedVersion", "kind"}
	switch value.Kind {
	case "append_story_turn":
		required = append(required, "turn")
	case "undo_story_turn":
		required = append(required, "turnId")
	case "edit_generated_passage", "edit_authored_passage":
		required = append(required, "turnId", "passageId", "body", "later")
	default:
		return ErrInvalidRequest
	}
	if len(fields) != len(required) {
		return ErrInvalidRequest
	}
	for _, field := range required {
		raw, ok := fields[field]
		if !ok || bytes.Equal(bytes.TrimSpace(raw), []byte("null")) {
			return ErrInvalidRequest
		}
	}
	*r = CommitRequest(value)
	return nil
}

func addStoryTables(tx *sql.Tx) error {
	// Additive, nonspatial schema extension: retain baseline, identity, epoch and
	// existing receipts byte-for-byte. Older wire clients are rejected explicitly.
	_, err := tx.Exec(`
 CREATE TABLE turns (
  adventure_id TEXT NOT NULL REFERENCES adventures(id) ON DELETE CASCADE,
  id TEXT NOT NULL, sequence INTEGER NOT NULL CHECK(sequence>0),
  schema_version INTEGER NOT NULL, events TEXT NOT NULL,
  PRIMARY KEY(adventure_id,id), UNIQUE(adventure_id,sequence));
 CREATE TABLE passages (
  adventure_id TEXT NOT NULL, id TEXT NOT NULL, turn_id TEXT NOT NULL,
  ordinal INTEGER NOT NULL CHECK(ordinal IN (0,1)), source TEXT NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY(adventure_id,id), UNIQUE(adventure_id,turn_id,ordinal),
  FOREIGN KEY(adventure_id,turn_id) REFERENCES turns(adventure_id,id) ON DELETE CASCADE);
 PRAGMA user_version = 2;`)
	return err
}

func validDocument(doc Document) bool {
	if doc.SchemaVersion != 1 || doc.Type != "doc" || len(doc.Content) == 0 || len(doc.Content) > 1000 {
		return false
	}
	characters, nodes := 0, 0
	hasText := false
	for _, paragraph := range doc.Content {
		if paragraph.Type != "paragraph" || paragraph.Content == nil {
			return false
		}
		for _, node := range paragraph.Content {
			nodes++
			switch node.Type {
			case "text":
				if node.Text == "" || !utf8.ValidString(node.Text) || strings.ContainsAny(node.Text, "\r\n") {
					return false
				}
				characters += utf8.RuneCountInString(node.Text)
				hasText = hasText || strings.TrimSpace(node.Text) != ""
			case "hard_break":
				if node.Text != "" {
					return false
				}
				characters++
			default:
				return false
			}
		}
	}
	// Paragraph separators contribute two codepoints to the plain-text projection.
	characters += 2 * (len(doc.Content) - 1)
	return hasText && characters <= 20000 && nodes <= 2000
}

func validTurn(turn Turn) bool {
	if turn.SchemaVersion != 1 || !identifier.MatchString(turn.ID) || turn.Order < 1 || (len(turn.Passages) < 1 || len(turn.Passages) > 2) || turn.Events == nil || len(turn.Events) != 0 {
		return false
	}
	ids := map[string]bool{turn.ID: true}
	for i, passage := range turn.Passages {
		expected := "authored"
		if i == 1 {
			expected = "generated"
		}
		if !identifier.MatchString(passage.ID) || ids[passage.ID] || passage.Source != expected || !validDocument(passage.Body) {
			return false
		}
		ids[passage.ID] = true
	}
	return true
}

func readHistory(ctx context.Context, tx *sql.Tx, id string, snapshot *Snapshot) error {
	var baseline string
	err := tx.QueryRowContext(ctx, `SELECT id,title,version,baseline FROM adventures WHERE id=?`, id).Scan(&snapshot.Adventure.ID, &snapshot.Adventure.Title, &snapshot.Adventure.Version, &baseline)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	if err = json.Unmarshal([]byte(baseline), &snapshot.Baseline); err != nil || snapshot.Baseline.SchemaVersion != baselineVersion {
		return ErrUnsupportedLibrary
	}
	rows, err := tx.QueryContext(ctx, `SELECT id,sequence,schema_version,events FROM turns WHERE adventure_id=? ORDER BY sequence`, id)
	if err != nil {
		return err
	}
	snapshot.Turns = []Turn{}
	for rows.Next() {
		var turn Turn
		var events string
		if err = rows.Scan(&turn.ID, &turn.Order, &turn.SchemaVersion, &events); err != nil {
			rows.Close()
			return err
		}
		if err = json.Unmarshal([]byte(events), &turn.Events); err != nil {
			rows.Close()
			return ErrUnsupportedHistory
		}
		turn.Passages = []Passage{}
		snapshot.Turns = append(snapshot.Turns, turn)
	}
	err = rows.Err()
	rows.Close()
	if err != nil {
		return err
	}
	// Keep the transaction open across both queries, so no mixed-version reads.
	for i := range snapshot.Turns {
		turn := &snapshot.Turns[i]
		rows, err = tx.QueryContext(ctx, `SELECT id,source,body,ordinal FROM passages WHERE adventure_id=? AND turn_id=? ORDER BY ordinal`, id, turn.ID)
		if err != nil {
			return err
		}
		for rows.Next() {
			var passage Passage
			var body string
			var ordinal int
			if err = rows.Scan(&passage.ID, &passage.Source, &body, &ordinal); err != nil {
				rows.Close()
				return err
			}
			if ordinal != len(turn.Passages) {
				rows.Close()
				return ErrUnsupportedHistory
			}
			decoder := json.NewDecoder(strings.NewReader(body))
			decoder.DisallowUnknownFields()
			if err = decoder.Decode(&passage.Body); err != nil {
				rows.Close()
				return ErrUnsupportedHistory
			}
			turn.Passages = append(turn.Passages, passage)
		}
		err = rows.Err()
		rows.Close()
		if err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) Commit(ctx context.Context, req CommitRequest) (CommitResult, error) {
	return s.commit(ctx, req, false)
}

func validHistory(snapshot Snapshot) bool {
	if int64(len(snapshot.Turns)) > snapshot.Adventure.Version {
		return false
	}
	ids := map[string]bool{}
	for i, turn := range snapshot.Turns {
		if !validTurn(turn) || turn.Order != int64(i+1) {
			return false
		}
		turnIDs := []string{turn.ID}
		for _, passage := range turn.Passages {
			turnIDs = append(turnIDs, passage.ID)
		}
		for _, id := range turnIDs {
			if ids[id] {
				return false
			}
			ids[id] = true
		}
	}
	return true
}

func storyReceiptKey(adventureID, operationID string) string {
	// ':' is forbidden in public IDs, making this composite namespace unambiguous.
	return "story:" + adventureID + ":" + operationID
}

func (s *Store) commit(ctx context.Context, req CommitRequest, failBeforeReceipt bool) (CommitResult, error) {
	if req.SchemaVersion != SchemaVersion || req.Epoch == "" || !identifier.MatchString(req.OperationID) || !identifier.MatchString(req.AdventureID) || req.ExpectedVersion < 0 || req.ExpectedVersion >= 9007199254740991 {
		return CommitResult{}, ErrInvalidRequest
	}
	if req.Kind != "edit_generated_passage" && req.Kind != "edit_authored_passage" && (req.PassageID != "" || req.Body != nil || req.Later != "") {
		return CommitResult{}, ErrInvalidRequest
	}
	switch req.Kind {
	case "append_story_turn":
		if !validTurn(req.Turn) || len(req.Turn.Passages) != 2 || req.TurnID != "" {
			return CommitResult{}, ErrInvalidRequest
		}
	case "undo_story_turn":
		if !identifier.MatchString(req.TurnID) || req.Turn.SchemaVersion != 0 || req.Turn.ID != "" || req.Turn.Order != 0 || req.Turn.Passages != nil || req.Turn.Events != nil {
			return CommitResult{}, ErrInvalidRequest
		}
	case "edit_generated_passage", "edit_authored_passage":
		if !identifier.MatchString(req.TurnID) || !identifier.MatchString(req.PassageID) || req.Body == nil || !validDocument(*req.Body) || (req.Later != "keep" && req.Later != "truncate") || req.Turn.SchemaVersion != 0 || req.Turn.ID != "" || req.Turn.Order != 0 || req.Turn.Passages != nil || req.Turn.Events != nil {
			return CommitResult{}, ErrInvalidRequest
		}
	default:
		return CommitResult{}, ErrInvalidRequest
	}
	encoded, err := json.Marshal(req)
	if err != nil {
		return CommitResult{}, err
	}
	fingerprint := fmt.Sprintf("%s:%x", req.Kind, sha256.Sum256(encoded))
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return CommitResult{}, err
	}
	defer tx.Rollback()
	currentEpoch, err := epoch(tx)
	if err != nil {
		return CommitResult{}, err
	}
	if currentEpoch != req.Epoch {
		return CommitResult{}, ErrWrongEpoch
	}
	var oldHash, receipt string
	key := storyReceiptKey(req.AdventureID, req.OperationID)
	err = tx.QueryRowContext(ctx, `SELECT request_hash,result FROM operations WHERE operation_id=?`, key).Scan(&oldHash, &receipt)
	if err == nil {
		if oldHash != fingerprint {
			return CommitResult{}, ErrOperationID
		}
		var result CommitResult
		if err = json.Unmarshal([]byte(receipt), &result); err != nil {
			return CommitResult{}, err
		}
		result.Replayed = true
		return result, nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return CommitResult{}, err
	}
	// Existing creation receipts use the original namespace. Prevent reusing one
	// within its own adventure, without coupling unrelated adventures' attempts.
	var creationReceipt string
	err = tx.QueryRowContext(ctx, `SELECT result FROM operations WHERE operation_id=?`, req.OperationID).Scan(&creationReceipt)
	if err == nil {
		var created Snapshot
		if err = json.Unmarshal([]byte(creationReceipt), &created); err != nil {
			return CommitResult{}, err
		}
		if created.Adventure.ID == req.AdventureID {
			return CommitResult{}, ErrOperationID
		}
	} else if !errors.Is(err, sql.ErrNoRows) {
		return CommitResult{}, err
	}
	snapshot := Snapshot{SchemaVersion: SchemaVersion, Epoch: currentEpoch}
	if err = readHistory(ctx, tx, req.AdventureID, &snapshot); err != nil {
		return CommitResult{}, err
	}
	if snapshot.Adventure.Version != req.ExpectedVersion {
		return CommitResult{}, ErrStaleVersion
	}
	if !validHistory(snapshot) {
		return CommitResult{}, ErrUnsupportedHistory
	}
	turnID := req.TurnID
	if req.Kind == "edit_generated_passage" || req.Kind == "edit_authored_passage" {
		if err = replacePassage(ctx, tx, req, snapshot); err != nil {
			return CommitResult{}, err
		}
	} else if req.Kind == "undo_story_turn" {
		if len(snapshot.Turns) == 0 || snapshot.Turns[len(snapshot.Turns)-1].ID != req.TurnID {
			return CommitResult{}, ErrInvalidRequest
		}
		if _, err = tx.ExecContext(ctx, `DELETE FROM turns WHERE adventure_id=? AND id=?`, req.AdventureID, req.TurnID); err != nil {
			return CommitResult{}, err
		}
	} else {
		if req.Turn.Order != int64(len(snapshot.Turns))+1 {
			return CommitResult{}, ErrInvalidRequest
		}
		for _, turn := range snapshot.Turns {
			if turn.ID == req.Turn.ID {
				return CommitResult{}, ErrInvalidRequest
			}
			for _, incoming := range req.Turn.Passages {
				if turn.ID == incoming.ID {
					return CommitResult{}, ErrInvalidRequest
				}
			}
			for _, passage := range turn.Passages {
				if passage.ID == req.Turn.ID {
					return CommitResult{}, ErrInvalidRequest
				}
				for _, incoming := range req.Turn.Passages {
					if passage.ID == incoming.ID {
						return CommitResult{}, ErrInvalidRequest
					}
				}
			}
		}
		events, err := json.Marshal(req.Turn.Events)
		if err != nil {
			return CommitResult{}, err
		}
		if _, err = tx.ExecContext(ctx, `INSERT INTO turns(adventure_id,id,sequence,schema_version,events) VALUES(?,?,?,?,?)`, req.AdventureID, req.Turn.ID, req.Turn.Order, req.Turn.SchemaVersion, string(events)); err != nil {
			return CommitResult{}, err
		}
		for i, passage := range req.Turn.Passages {
			body, err := json.Marshal(passage.Body)
			if err != nil {
				return CommitResult{}, err
			}
			if _, err = tx.ExecContext(ctx, `INSERT INTO passages(adventure_id,id,turn_id,ordinal,source,body) VALUES(?,?,?,?,?,?)`, req.AdventureID, passage.ID, req.Turn.ID, i, passage.Source, string(body)); err != nil {
				return CommitResult{}, err
			}
		}
		turnID = req.Turn.ID
		// Consume only accepted input; Undo preserves the latest noncanonical draft.
		if _, err = tx.ExecContext(ctx, `DELETE FROM drafts WHERE adventure_id=? AND target='composer_story' AND text=?`, req.AdventureID, documentText(req.Turn.Passages[0].Body)); err != nil {
			return CommitResult{}, err
		}
	}
	if _, err = tx.ExecContext(ctx, `DELETE FROM drafts WHERE adventure_id=? AND target LIKE 'passage:%' AND NOT EXISTS (SELECT 1 FROM passages WHERE passages.adventure_id=drafts.adventure_id AND 'passage:' || passages.id=drafts.target)`, req.AdventureID); err != nil {
		return CommitResult{}, err
	}
	if _, err = tx.ExecContext(ctx, `UPDATE adventures SET version=? WHERE id=?`, req.ExpectedVersion+1, req.AdventureID); err != nil {
		return CommitResult{}, err
	}
	result := CommitResult{SchemaVersion: SchemaVersion, Epoch: currentEpoch, AdventureID: req.AdventureID, OperationID: req.OperationID, Version: req.ExpectedVersion + 1, TurnID: turnID}
	receiptBytes, err := json.Marshal(result)
	if err != nil {
		return CommitResult{}, err
	}
	if failBeforeReceipt {
		return CommitResult{}, errors.New("injected_transaction_failure")
	}
	if _, err = tx.ExecContext(ctx, `INSERT INTO operations VALUES(?,?,?)`, key, fingerprint, string(receiptBytes)); err != nil {
		return CommitResult{}, err
	}
	if err = tx.Commit(); err != nil {
		return CommitResult{}, err
	}
	return result, nil
}
