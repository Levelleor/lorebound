package store

import (
	"context"
	"database/sql"
	"encoding/json"
)

func replaceGeneratedPassage(ctx context.Context, tx *sql.Tx, req CommitRequest, snapshot Snapshot) error {
	var target *Turn
	for i := range snapshot.Turns {
		turn := &snapshot.Turns[i]
		if turn.ID == req.TurnID && turn.Passages[1].ID == req.PassageID {
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
		if _, err = tx.ExecContext(ctx, `DELETE FROM turns WHERE adventure_id=? AND sequence>?`, req.AdventureID, target.Order); err != nil {
			return err
		}
	}
	_, err = tx.ExecContext(ctx, `DELETE FROM drafts WHERE adventure_id=? AND target=? AND text=?`, req.AdventureID, "passage:"+req.PassageID, documentText(*req.Body))
	return err
}
