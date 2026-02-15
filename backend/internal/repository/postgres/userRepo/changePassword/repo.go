package changePasswordRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/userDDL"
	"renal_tracker/tools/sql"

	sq "github.com/Masterminds/squirrel"
)

type ChangePasswordRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *ChangePasswordRepo {
	return &ChangePasswordRepo{
		db: db,
	}
}

func (c *ChangePasswordRepo) ChangePassword(ctx context.Context, id string, passwordHash, passwordSalt []byte) error {
	return c.db.Exec(ctx, sq.Update(userDDL.Table).
		SetMap(map[string]any{
			userDDL.ColumnPasswordHash: passwordHash,
			userDDL.ColumnPasswordSalt: passwordSalt,
		}).Where(userDDL.ColumnID, id),
	)
}
