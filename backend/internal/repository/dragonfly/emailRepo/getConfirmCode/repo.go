package getConfirmCodeRepo

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type GetConfirmCodeRepo struct {
	emailCache *redis.Client
}

func New(emailCache *redis.Client) *GetConfirmCodeRepo {
	return &GetConfirmCodeRepo{
		emailCache: emailCache,
	}
}

func (g *GetConfirmCodeRepo) GetConfirmCode(ctx context.Context, userEmail string) (string, error) {
	confirmCode, err := g.emailCache.Get(ctx, userEmail).Result()
	if err != nil {
		return confirmCode, err
	}

	return confirmCode, nil
}
