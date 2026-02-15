package authUserUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/user/updateInfoPkg"
	"time"
)

type findUserByEmail interface {
	FindUserByEmail(ctx context.Context, email string) (userModel.User, error)
}

type updateUserInfo interface {
	UpdateUserInfo(ctx context.Context, user updateInfoPkg.UpdateUserInfoV0Request, id string, lastLoginAt *time.Time) error
}
