package tokenService

import (
	"context"
	"renal_tracker/internal/model/userModel"
)

type findUserByID interface {
	FindUserByID(ctx context.Context, id string) (userModel.User, error)
}

type getUser interface {
	GetUser(ctx context.Context, userID string) (userModel.User, error)
}

type setUser interface {
	SetUser(ctx context.Context, user userModel.User) error
}
