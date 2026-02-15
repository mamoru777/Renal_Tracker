package userDDL

import "renal_tracker/internal/ddl/pgsqlDDL"

const (
	Table          = pgsqlDDL.SchemaRenal + "." + "user"
	TableWithAlias = Table + " " + alias
	alias          = "u"
)

const (
	ColumnID           = "id"
	ColumnName         = "name"
	ColumnSurname      = "surname"
	ColumnPatronymic   = "patronymic"
	ColumnEmail        = "email"
	ColumnPasswordHash = "password_hash"
	ColumnPasswordSalt = "password_salt"
	ColumnBirth        = "birth"
	ColumnSex          = "sex"
	ColumnWeight       = "weight"
	ColumnHeight       = "height"
	ColumnLastLoginAt  = "last_login_at"
)

func WithPrefix(column string) string {
	return alias + "." + column
}
