package store

import (
	"context"
	"database/sql"
	"encoding/json"
)

func replacePassage(ctx context.Context, tx *sql.Tx, req CommitRequest, snapshot Snapshot) error {
	var target *Turn
	position := 1
	if req.Kind == "edit_authored_passage" {
		position = 0
	}
	for i := range snapshot.Turns {
		turn := &snapshot.Turns[i]
		if turn.ID == req.TurnID && len(turn.Passages) > position && turn.Passages[position].ID == req.PassageID {
			target = turn
			break
		}
	}
	if target == nil {
		return ErrInvalidRequest
	}
	body, err := json.Marshal(req.Body)
	if err != nil {
		return err
	}
	if _, err = tx.ExecContext(ctx, `UPDATE passages SET body=? WHERE adventure_id=? AND id=?`, string(body), req.AdventureID, req.PassageID); err != nil {
		return err
	}
	if req.Later == "truncate" {
		if _, err = tx.ExecContext(ctx, `DELETE FROM passages WHERE adventure_id=? AND turn_id=? AND ordinal>?`, req.AdventureID, target.ID, position); err != nil {
			return err
		}
		if _, err = tx.ExecContext(ctx, `DELETE FROM turns WHERE adventure_id=? AND sequence>?`, req.AdventureID, target.Order); err != nil {
			return err
		}
	}
	_, err = tx.ExecContext(ctx, `DELETE FROM drafts WHERE adventure_id=? AND target=? AND text=?`, req.AdventureID, "passage:"+req.PassageID, documentText(*req.Body))
	return err
}
