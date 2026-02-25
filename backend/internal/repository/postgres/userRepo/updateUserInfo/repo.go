package updateUserInfoRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/userDDL"
	"renal_tracker/pkg/user/updateInfoPkg"
	"renal_tracker/tools/sql"
	"time"

	sq "github.com/Masterminds/squirrel"
)

type UpdateUserInfoRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *UpdateUserInfoRepo {
	return &UpdateUserInfoRepo{
		db: db,
	}
}

func (u *UpdateUserInfoRepo) UpdateUserInfo(ctx context.Context, user updateInfoPkg.UpdateUserInfoV0Request, id string, lastLoginAt *time.Time) error {
	mpUpdate := make(map[string]any, 8)

	if user.Patronymic != nil {
		mpUpdate[userDDL.ColumnPatronymic] = *user.Patronymic
	}

	if user.Weight != nil {
		mpUpdate[userDDL.ColumnWeight] = *user.Weight
	}

	if user.Height != nil {
		mpUpdate[userDDL.ColumnHeight] = *user.Height
	}

	if user.Name != nil {
		mpUpdate[userDDL.ColumnName] = *user.Name
	}

	if user.Surname != nil {
		mpUpdate[userDDL.ColumnSurname] = *user.Surname
	}

	if user.DateBirth != nil {
		mpUpdate[userDDL.ColumnBirth] = *user.DateBirth
	}

	if user.Sex != nil {
		mpUpdate[userDDL.ColumnSex] = *user.Sex
	}

	if lastLoginAt != nil {
		mpUpdate[userDDL.ColumnLastLoginAt] = *lastLoginAt
	}

	return u.db.Exec(ctx, sq.Update(userDDL.Table).
		SetMap(mpUpdate).Where(sq.Eq{userDDL.ColumnID: id}),
	)
}
