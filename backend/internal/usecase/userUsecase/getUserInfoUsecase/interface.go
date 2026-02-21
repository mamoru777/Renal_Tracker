package getUserInfoUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
)

type findUserByID interface {
	FindUserByID(ctx context.Context, id string) (userModel.User, error)
}
