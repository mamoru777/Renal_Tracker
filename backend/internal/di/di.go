package di

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"renal_tracker/cfg"
	"renal_tracker/internal/api"
	changePasswordRepo "renal_tracker/internal/repository/postgres/userRepo/changePassword"
	createUserRepo "renal_tracker/internal/repository/postgres/userRepo/createUser"
	findUserByEmailRepo "renal_tracker/internal/repository/postgres/userRepo/findUserByEmail"
	findUserByIDRepo "renal_tracker/internal/repository/postgres/userRepo/findUserByID"
	updateUserInfoRepo "renal_tracker/internal/repository/postgres/userRepo/updateUserInfo"
	"renal_tracker/internal/usecase/userUsecase/authUserUsecase"
	"renal_tracker/internal/usecase/userUsecase/changePasswordUsecase"
	"renal_tracker/internal/usecase/userUsecase/checkEmailUsecase"
	"renal_tracker/internal/usecase/userUsecase/createUserUsecase"
	"renal_tracker/internal/usecase/userUsecase/updateUserInfoUsecase"
	jwtManager "renal_tracker/tools/jwt"
	"renal_tracker/tools/migrator"
	"renal_tracker/tools/pgsql"
	"renal_tracker/tools/sql"
	"syscall"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/gofiber/fiber/v2"
	"github.com/pressly/goose/v3"

	pgsqlMigraions "renal_tracker/migrations/pgsql"
)

type DI struct {
	config cfg.Config

	infr struct {
		db *sql.DB
	}

	repo struct {
		createUserRepo      *createUserRepo.CreateUserRepo
		changePasswordRepo  *changePasswordRepo.ChangePasswordRepo
		findUserByEmailRepo *findUserByEmailRepo.FindUserByEmailRepo
		findUserByIDRepo    *findUserByIDRepo.FindUserByIDRepo
		updateUserInfoRepo  *updateUserInfoRepo.UpdateUserInfoRepo
	}

	useCases struct {
		createUserUseCase     *createUserUsecase.UseCase
		authUserUsecase       *authUserUsecase.UseCase
		changePasswordUsecase *changePasswordUsecase.UseCase
		checkEmailUsecase     *checkEmailUsecase.UseCase
		updateUserInfoUsecase *updateUserInfoUsecase.UseCase
	}

	api *api.API

	app *fiber.App
}

func (di *DI) Init(ctx context.Context) error {
	log.Info().Msg("start init services")

	di.loadCfg()

	if err := di.initInfra(ctx); err != nil {
		return err
	}

	if err := di.initJWTManager(); err != nil {
		return err
	}

	if err := di.initMigrations(ctx); err != nil {
		return err
	}

	di.initRepos()

	di.initUsecases()

	di.initServer()

	return nil
}

func (di *DI) loadCfg() {
	log.Info().Msg("load cfg")

	di.config = cfg.Load()
}

func (di *DI) initInfra(ctx context.Context) (err error) {
	log.Info().Msg("init infra")

	connectionURI := pgsql.GetConnectionURI(
		di.config.Pgsql.Host,
		di.config.Pgsql.User,
		di.config.Pgsql.Password,
		di.config.Pgsql.Database,
	)

	di.infr.db, err = pgsql.NewClientPgsql(ctx, connectionURI)
	if err != nil {
		return err
	}

	return nil
}

func (di *DI) initJWTManager() error {
	accessTokenTTL, err := time.ParseDuration(di.config.Auth.AccessTokenTTL)
	if err != nil {
		return err
	}

	refreshTokenTTL, err := time.ParseDuration(di.config.Auth.RefreshTokenTTL)
	if err != nil {
		return err
	}

	jwtManager.Init([]byte(di.config.Auth.SigningKey), accessTokenTTL, refreshTokenTTL)

	return nil
}

func (di *DI) initMigrations(ctx context.Context) error {
	log.Info().Msg("init migrations")

	pgsqlMigrator, err := migrator.NewMigrator(
		migrator.MigratorConfig{
			Conn:            di.infr.db.DB.DB,
			EmbedMigrations: pgsqlMigraions.EmbedMigrationsPgsql,
			Dialect:         goose.DialectPostgres,
			Dir:             "pgsql",
			Migrations:      nil,
		},
	)
	if err != nil {
		return err
	}
	if err = pgsqlMigrator.Up(ctx); err != nil {
		return err
	}

	return nil
}

func (di *DI) initRepos() {
	log.Info().Msg("init repos")

	di.repo.createUserRepo = createUserRepo.New(di.infr.db)
	di.repo.changePasswordRepo = changePasswordRepo.New(di.infr.db)
	di.repo.findUserByEmailRepo = findUserByEmailRepo.New(di.infr.db)
	di.repo.findUserByIDRepo = findUserByIDRepo.New(di.infr.db)
	di.repo.updateUserInfoRepo = updateUserInfoRepo.New(di.infr.db)
}

func (di *DI) initUsecases() {
	log.Info().Msg("init usecases")

	di.useCases.createUserUseCase = createUserUsecase.New(di.repo.createUserRepo, di.repo.findUserByEmailRepo)
	di.useCases.authUserUsecase = authUserUsecase.New(di.repo.findUserByEmailRepo, di.repo.updateUserInfoRepo)
	di.useCases.changePasswordUsecase = changePasswordUsecase.New(di.repo.findUserByIDRepo, di.repo.changePasswordRepo)
	di.useCases.checkEmailUsecase = checkEmailUsecase.New(di.repo.findUserByEmailRepo)
	di.useCases.updateUserInfoUsecase = updateUserInfoUsecase.New(di.repo.updateUserInfoRepo, di.repo.findUserByIDRepo)
}

func (di *DI) initServer() {
	log.Info().Msg("init server")

	di.app = fiber.New()
}

func (di *DI) Start() error {
	log.Info().Msg(fmt.Sprintf("starting server on port - %s", di.config.Port))

	if err := di.app.Listen(fmt.Sprintf(":%s", di.config.Port)); err != nil {
		return err
	}

	return nil
}

func (di *DI) Stop(ctx context.Context) {
	stopCh := make(chan os.Signal, 1)
	signal.Notify(stopCh, syscall.SIGINT, syscall.SIGTERM)

	defer signal.Stop(stopCh)

	select {
	case <-stopCh:
	case <-ctx.Done():
	}

	log.Info().Msg("stopping server")

	if err := di.app.Shutdown(); err != nil {
		log.Error().Err(err).Msg("server shutdown error")
	}

	_ = di.infr.db.Close()
}
