package cfg

import "renal_tracker/tools/env"

type Config struct {
	Port string `env:"SERVER_PORT"`

	Pgsql struct {
		Host     string `env:"PGSQL_EXCHANGE_HOST"`
		User     string `env:"PGSQL_EXCHANGE_USER"`
		Password string `env:"PGSQL_EXCHANGE_PASSWORD"`
		Database string `env:"PGSQL_EXCHANGE_DATABASE"`
	}

	Auth struct {
		GeneralSalt     string `env:"AUTH_GENERAL_SALT"`
		SigningKey      string `env:"AUTH_SIGNING_KEY"`
		AccessTokenTTL  string `env:"ACCESS_TOKEN_TTL"`
		RefreshTokenTTL string `env:"REFRESH_TOKEN_TTL"`
	}
}

func Load() Config {
	return env.Load[Config]()
}
