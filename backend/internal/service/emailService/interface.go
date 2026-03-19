package emailService

import "context"

type getConfirmCode interface {
	GetConfirmCode(ctx context.Context, userEmail string) (string, error)
}

type setConfirmCode interface {
	SetConfirmCode(ctx context.Context, userEmail, confirmCode string) error
}
