package main

import (
	"context"
	"os"
	"renal_tracker/internal/di"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	log.Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()

	di := di.DI{}
	if err := di.Init(ctx); err != nil {
		log.Err(err).Msg("can not init service")
	}

	go func() {
		if err := di.Start(); err != nil {
			log.Err(err).Msg("error ocured while starting server")
			cancel()
		}
	}()

	di.Stop(ctx)
}
