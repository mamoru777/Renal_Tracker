package createGfrResultRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/gfrDDL"
	"renal_tracker/internal/enum/gfrCurrency"
	"renal_tracker/pkg/gfr/saveResultPkg"
	"renal_tracker/tools/sql"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
)

type CreateGfrResultRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *CreateGfrResultRepo {
	return &CreateGfrResultRepo{
		db: db,
	}
}

func (c *CreateGfrResultRepo) CreateGfrResult(ctx context.Context, model saveResultPkg.SaveResultV0Request, userID string) (string, error) {
	id := uuid.NewString()

	mpInsert := make(map[string]any, 16)

	mpInsert[gfrDDL.ColumnID] = id

	mpInsert[gfrDDL.ColumnUserID] = userID

	if model.Creatinine != nil {
		mpInsert[gfrDDL.ColumnCreatinine] = *model.Creatinine
	}

	if model.CreatinineCurrency != nil {
		mpInsert[gfrDDL.ColumnCreatinineCurrency] = *model.CreatinineCurrency
	}

	if model.Weight != nil {
		mpInsert[gfrDDL.ColumnWeight] = *model.Weight
	}

	if model.Height != nil {
		mpInsert[gfrDDL.ColumnHeight] = *model.Height
	}

	if model.Sex != nil {
		mpInsert[gfrDDL.ColumnSex] = *model.Sex
	}

	if model.BSA != nil {
		mpInsert[gfrDDL.ColumnBSA] = *model.BSA
	}

	if model.Age != nil {
		mpInsert[gfrDDL.ColumnAge] = *model.Age
	}

	mpInsert[gfrDDL.ColumnGFR] = model.GFR

	if model.GFRCurrency != nil {
		mpInsert[gfrDDL.ColumnGFRCurrency] = *model.GFRCurrency
	} else {
		mpInsert[gfrDDL.ColumnGFRCurrency] = gfrCurrency.ML_MIN_M2
	}

	if model.IsAbsolute != nil {
		mpInsert[gfrDDL.ColumnIsAbsolute] = *model.IsAbsolute
	}

	mpInsert[gfrDDL.ColumnCreatinineTestDate] = model.CreatinineTestDate

	if model.GFRMediumStart != nil {
		mpInsert[gfrDDL.ColumnGFRMediumStart] = *model.GFRMediumStart
	}

	if model.GFRMediumEnd != nil {
		mpInsert[gfrDDL.ColumnGFRMediumEnd] = *model.GFRMediumEnd
	}

	if model.GFRMinimum != nil {
		mpInsert[gfrDDL.ColumnGFRMinimum] = *model.GFRMinimum
	}

	return id, c.db.Exec(ctx, sq.
		Insert(gfrDDL.Table).
		SetMap(mpInsert),
	)
}
