package updateUserInfoUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/user/updateInfoPkg"
	"time"
)

type updateUserInfo interface {
	UpdateUserInfo(ctx context.Context, user updateInfoPkg.UpdateUserInfoV0Request, id string, lastLoginAt *time.Time) error
}

type findUserByID interface {
	FindUserByID(ctx context.Context, id string) (userModel.User, error)
}
