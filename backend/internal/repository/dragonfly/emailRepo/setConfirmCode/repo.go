package setConfirmCodeRepo

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type Config struct {
	EmailCacheTTL    time.Duration
	EmailCacheTTLStr string `env:"EMAIL_CACHE_TTL"`
}

type SetConfirmCodeRepo struct {
	config     Config
	emailCache *redis.Client
}

func New(config Config, emailCache *redis.Client) *SetConfirmCodeRepo {
	return &SetConfirmCodeRepo{
		config:     config,
		emailCache: emailCache,
	}
}

func (s *SetConfirmCodeRepo) SetConfirmCode(ctx context.Context, userEmail, confirmCode string) error {
	_, err := s.emailCache.Set(ctx, userEmail, confirmCode, s.config.EmailCacheTTL).Result()
	if err != nil {
		return err
	}

	return nil
}
