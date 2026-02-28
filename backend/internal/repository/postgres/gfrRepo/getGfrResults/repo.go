package getGfrResultsRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/gfrDDL"
	"renal_tracker/internal/model/gfrModel"
	"renal_tracker/pkg/gfr/getResultsPkg"
	"renal_tracker/tools/sql"

	sq "github.com/Masterminds/squirrel"
)

type GetGfrResultsRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *GetGfrResultsRepo {
	return &GetGfrResultsRepo{
		db: db,
	}
}

func (g *GetGfrResultsRepo) GetGfrResults(ctx context.Context, userID string, req getResultsPkg.GetResultsV0Request) ([]gfrModel.GfrResult, error) {
	models := make([]gfrModel.GfrResult, 0)

	q := sq.Select(
		"*",
	).From(gfrDDL.Table).Where(sq.Eq{gfrDDL.ColumnUserID: userID})

	if len(req.IDs) > 0 {
		q = q.Where(sq.Eq{gfrDDL.ColumnID: req.IDs})
	}

	if req.Limit != nil {
		q = q.Limit(uint64(*req.Limit))
	}

	if req.Offset != nil {
		q = q.Offset(uint64(*req.Offset))
	}

	err := g.db.Select(ctx, &models, q)
	if err != nil {
		return nil, err
	}

	return models, nil
}
