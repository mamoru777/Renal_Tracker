package updateUserInfoUsecase

import (
	"context"
	"renal_tracker/pkg/user/updateInfoPkg"
	"time"
)

type updateUserInfo interface {
	UpdateUserInfo(ctx context.Context, user updateInfoPkg.UpdateUserInfoV0Request, id string, lastLoginAt *time.Time) error
}
