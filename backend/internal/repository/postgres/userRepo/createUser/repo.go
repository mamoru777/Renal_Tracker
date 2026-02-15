package createUserRepo

import (
	"context"
	"renal_tracker/internal/ddl/pgsqlDDL/userDDL"
	"renal_tracker/pkg/user/registrationPkg"

	"renal_tracker/tools/sql"

	"github.com/google/uuid"

	sq "github.com/Masterminds/squirrel"
)

type CreateUserRepo struct {
	db sql.SQL
}

func New(db sql.SQL) *CreateUserRepo {
	return &CreateUserRepo{
		db: db,
	}
}

func (c *CreateUserRepo) CreateUser(ctx context.Context, user registrationPkg.RegistrationV0Request, passwordHash, passwordSalt []byte) (string, error) {

	id := uuid.NewString()

	mpInsert := make(map[string]any, 11)

	if user.Patronymic != nil {
		mpInsert[userDDL.ColumnPatronymic] = user.Patronymic
	}

	if user.Weight != nil {
		mpInsert[userDDL.ColumnWeight] = user.Weight
	}

	if user.Height != nil {
		mpInsert[userDDL.ColumnHeight] = user.Height
	}

	mpInsert[userDDL.ColumnID] = id
	mpInsert[userDDL.ColumnEmail] = user.Email
	mpInsert[userDDL.ColumnPasswordHash] = passwordHash
	mpInsert[userDDL.ColumnPasswordSalt] = passwordSalt
	mpInsert[userDDL.ColumnName] = user.Name
	mpInsert[userDDL.ColumnSurname] = user.Surname
	mpInsert[userDDL.ColumnBirth] = user.DateBirth
	mpInsert[userDDL.ColumnSex] = user.Sex

	return id, c.db.Exec(ctx, sq.
		Insert(userDDL.Table).
		SetMap(mpInsert),
	)
}
