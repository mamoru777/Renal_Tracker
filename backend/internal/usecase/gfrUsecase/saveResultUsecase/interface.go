package saveResultUsecase

import (
	"context"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/gfr/saveResultPkg"
)

type findUserByID interface {
	FindUserByID(ctx context.Context, id string) (userModel.User, error)
}

type createGfrResult interface {
	CreateGfrResult(ctx context.Context, model saveResultPkg.SaveResultV0Request, userID string) (string, error)
}
