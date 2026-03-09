package setUserRepo

import (
	"context"
	"encoding/json"
	"renal_tracker/internal/model/userModel"
	"time"

	"github.com/redis/go-redis/v9"
)

type Config struct {
	UserCacheTTL    time.Duration
	UserCacheTTLStr string `env:"USER_CACHE_TTL"`
}

type SetUserRepo struct {
	config    Config
	userCache *redis.Client
}

func New(config Config, userCache *redis.Client) *SetUserRepo {
	return &SetUserRepo{
		config:    config,
		userCache: userCache,
	}
}

func (s *SetUserRepo) SetUser(ctx context.Context, user userModel.User) error {
	userJson, err := json.Marshal(user)
	if err != nil {
		return err
	}

	_, err = s.userCache.Set(ctx, user.ID, userJson, s.config.UserCacheTTL).Result()
	if err != nil {
		return err
	}

	return nil
}
