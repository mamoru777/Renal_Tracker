package changePasswordUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
)

type findUserByID interface {
	FindUserByID(ctx context.Context, id string) (userModel.User, error)
}

type changePassword interface {
	ChangePassword(ctx context.Context, id string, passwordHash, passwordSalt []byte) error
}
