package deleteConfirmCodeRepo

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type DeleteConfirmCodeRepo struct {
	emailCache *redis.Client
}

func New(emailCache *redis.Client) *DeleteConfirmCodeRepo {
	return &DeleteConfirmCodeRepo{
		emailCache: emailCache,
	}
}

func (d *DeleteConfirmCodeRepo) DeleteConfirmCode(ctx context.Context, userEmail string) error {
	_, err := d.emailCache.Del(ctx, userEmail).Result()

	return err
}
