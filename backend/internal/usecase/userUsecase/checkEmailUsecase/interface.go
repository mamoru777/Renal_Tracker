package checkEmailUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
)

type findUserByEmail interface {
	FindUserByEmail(ctx context.Context, email string) (userModel.User, error)
}
