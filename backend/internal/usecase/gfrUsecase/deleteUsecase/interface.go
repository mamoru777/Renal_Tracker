package deleteUsecase

import "context"

type delete interface {
	Delete(ctx context.Context, gfrID []string, userID string) error
}
