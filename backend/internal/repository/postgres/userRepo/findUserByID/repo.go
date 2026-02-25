package findUserByIDRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/userDDL"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/tools/sql"

	sq "github.com/Masterminds/squirrel"
)

type FindUserByIDRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *FindUserByIDRepo {
	return &FindUserByIDRepo{
		db: db,
	}
}

func (f *FindUserByIDRepo) FindUserByID(ctx context.Context, id string) (userModel.User, error) {
	user := userModel.User{}

	if err := f.db.Get(ctx, &user, sq.Select("*").From(userDDL.Table).Where(sq.Eq{userDDL.ColumnID: id})); err != nil {
		return user, err
	}

	return user, nil
}
