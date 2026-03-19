package changePasswordUsecase

import (
	"context"
)

type changePassword interface {
	ChangePassword(ctx context.Context, id string, passwordHash, passwordSalt []byte) error
}
