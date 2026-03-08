package deleteGfrResultRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/gfrDDL"
	"renal_tracker/tools/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
)

type DeleteGfrResultRepository struct {
	db sql.SQL
}

func New(db sql.SQL) *DeleteGfrResultRepository {
	return &DeleteGfrResultRepository{db: db}
}

func (d *DeleteGfrResultRepository) Delete(ctx context.Context, gfrID []string, userID string) error {
	return d.db.Exec(ctx, sq.Update(gfrDDL.Table).
		SetMap(map[string]interface{}{
			gfrDDL.ColumnIsDeleted: true,
			gfrDDL.ColumnDeletedAt: time.Now(),
		}).
		Where(sq.Eq{gfrDDL.ColumnID: gfrID}).
		Where(sq.Eq{gfrDDL.ColumnUserID: userID}))
}
