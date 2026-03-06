package gfrDDL

import "renal_tracker/internal/ddl/pgsqlDDL"

const (
	Table          = pgsqlDDL.SchemaRenal + "." + "gfr_results"
	TableWithAlias = Table + " " + alias
	alias          = "gr"
)

const (
	ColumnID                 = "id"
	ColumnUserID             = "user_id"
	ColumnCreatinine         = "creatinine"
	ColumnCreatinineCurrency = "creatinine_currency"
	ColumnWeight             = "weight"
	ColumnHeight             = "height"
	ColumnSex                = "sex"
	ColumnBSA                = "bsa"
	ColumnAge                = "age"
	ColumnGFR                = "gfr"
	ColumnGFRCurrency        = "gfr_currency"
	ColumnGFRMediumStart     = "gfr_medium_start"
	ColumnGFRMediumEnd       = "gfr_medium_end"
	ColumnGFRMinimum         = "gfr_minimum"
	ColumnIsAbsolute         = "is_absolute"
	ColumnCreatedAt          = "created_at"
	ColumnCreatinineTestDate = "creatinine_test_date"
)

func WithPrefix(column string) string {
	return alias + "." + column
}
