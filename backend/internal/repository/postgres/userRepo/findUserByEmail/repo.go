package findUserByEmailRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/userDDL"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/tools/sql"

	sq "github.com/Masterminds/squirrel"
)

type FindUserByEmailRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *FindUserByEmailRepo {
	return &FindUserByEmailRepo{
		db: db,
	}
}

func (f *FindUserByEmailRepo) FindUserByEmail(ctx context.Context, email string) (userModel.User, error) {
	user := userModel.User{}

	if err := f.db.Get(ctx, &user, sq.Select("*").From(userDDL.Table).Where(sq.Eq{userDDL.ColumnEmail: email})); err != nil {
		return user, err
	}

	return user, nil
}
