package getUserRepo

import (
	"context"
	"encoding/json"
	"renal_tracker/internal/model/userModel"

	"github.com/redis/go-redis/v9"
)

type GetUserRepo struct {
	userCache *redis.Client
}

func New(userCache *redis.Client) *GetUserRepo {
	return &GetUserRepo{
		userCache: userCache,
	}
}

func (g *GetUserRepo) GetUser(ctx context.Context, userID string) (userModel.User, error) {
	res := userModel.User{}

	userJson, err := g.userCache.Get(ctx, userID).Result()
	if err != nil {
		return res, err
	}

	err = json.Unmarshal([]byte(userJson), &res)
	if err != nil {
		return res, err
	}

	return res, nil
}
