package createUserUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/user/registrationPkg"
)

type createUser interface {
	CreateUser(ctx context.Context, user registrationPkg.RegistrationV0Request, passwordHash, passwordSalt []byte) (string, error)
}

type findUserByEmail interface {
	FindUserByEmail(ctx context.Context, email string) (userModel.User, error)
}
