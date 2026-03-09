package cfg

import (
	setUserRepo "renal_tracker/internal/repository/dragonfly/userRepo/setUser"
	"renal_tracker/internal/usecase/tokenUsecase/tokensRefreshUsecase"
	"renal_tracker/internal/usecase/userUsecase/authUserUsecase"
	"renal_tracker/tools/env"

	"renal_tracker/tools/database/redis"
)

type Config struct {
	Port string `env:"SERVER_PORT"`

	Pgsql struct {
		Host     string `env:"PGSQL_EXCHANGE_HOST"`
		User     string `env:"PGSQL_EXCHANGE_USER"`
		Password string `env:"PGSQL_EXCHANGE_PASSWORD"`
		Database string `env:"PGSQL_EXCHANGE_DATABASE"`
	}

	Dragonfly redis.RedisConfigEnv

	Auth struct {
		GeneralSalt     string `env:"AUTH_GENERAL_SALT"`
		SigningKey      string `env:"AUTH_SIGNING_KEY"`
		AccessTokenTTL  string `env:"ACCESS_TOKEN_TTL"`
		RefreshTokenTTL string `env:"REFRESH_TOKEN_TTL"`
	}

	SetUserRepoConfig setUserRepo.Config

	AuthUseCaseConfig authUserUsecase.Config

	TokensRefreshUsecaseConfig tokensRefreshUsecase.Config
}

func Load() Config {
	return env.Load[Config]()
}
