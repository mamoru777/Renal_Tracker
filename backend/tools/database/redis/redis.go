package redis

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisConfigEnv struct {
	Host     string `env:"REDIS_HOST"`
	Port     string `env:"REDIS_PORT"`
	User     string `env:"REDIS_USER" envDefault:""`
	Password string `env:"REDIS_PASSWORD"`
}

func NewClientRedis(cfg RedisConfigEnv, database int) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Network:                    "",
		Addr:                       fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		ClientName:                 "",
		Dialer:                     nil,
		OnConnect:                  nil,
		Protocol:                   0,
		Username:                   "",
		Password:                   cfg.Password,
		CredentialsProvider:        nil,
		CredentialsProviderContext: nil,
		DB:                         database,
		MaxRetries:                 0,
		MinRetryBackoff:            0,
		MaxRetryBackoff:            0,
		DialTimeout:                500 * time.Millisecond,
		ReadTimeout:                500 * time.Millisecond,
		WriteTimeout:               500 * time.Millisecond,
		ContextTimeoutEnabled:      false,
		PoolFIFO:                   false,
		PoolSize:                   20,
		PoolTimeout:                501 * time.Millisecond,
		MinIdleConns:               20,
		MaxIdleConns:               0,
		MaxActiveConns:             0,
		ConnMaxIdleTime:            0,
		ConnMaxLifetime:            0,
		TLSConfig:                  nil,
		Limiter:                    nil,
		DisableIndentity:           false,
		IdentitySuffix:             "",
		UnstableResp3:              false,
	})

	// Проверяем соединение
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		return nil, err
	}

	// Возвращаем клиент
	return client, nil
}
