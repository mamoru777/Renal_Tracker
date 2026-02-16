package api

import (
	"renal_tracker/internal/service/tokenService"
	"renal_tracker/internal/usecase/userUsecase/authUserUsecase"
	"renal_tracker/internal/usecase/userUsecase/changePasswordUsecase"
	"renal_tracker/internal/usecase/userUsecase/checkEmailUsecase"
	"renal_tracker/internal/usecase/userUsecase/createUserUsecase"
	"renal_tracker/internal/usecase/userUsecase/updateUserInfoUsecase"
	"renal_tracker/pkg/user/authPkg"
	"renal_tracker/pkg/user/changePasswordPkg"
	"renal_tracker/pkg/user/checkEmailPkg"
	"renal_tracker/pkg/user/registrationPkg"
	"renal_tracker/pkg/user/updateInfoPkg"

	_ "renal_tracker/swagger"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

type API struct {
	app *fiber.App

	createUserUseCase     *createUserUsecase.UseCase
	authUserUsecase       *authUserUsecase.UseCase
	changePasswordUsecase *changePasswordUsecase.UseCase
	checkEmailUsecase     *checkEmailUsecase.UseCase
	updateUserInfoUsecase *updateUserInfoUsecase.UseCase
}

func New(
	app *fiber.App,
	createUserUseCase *createUserUsecase.UseCase,
	authUserUsecase *authUserUsecase.UseCase,
	changePasswordUsecase *changePasswordUsecase.UseCase,
	checkEmailUsecase *checkEmailUsecase.UseCase,
	updateUserInfoUsecase *updateUserInfoUsecase.UseCase,
) *API {
	return &API{
		app:                   app,
		createUserUseCase:     createUserUseCase,
		authUserUsecase:       authUserUsecase,
		changePasswordUsecase: changePasswordUsecase,
		checkEmailUsecase:     checkEmailUsecase,
		updateUserInfoUsecase: updateUserInfoUsecase,
	}
}

func (a *API) Route() {
	a.app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "pong",
		})
	})

	a.app.Get("/swagger/*", swagger.HandlerDefault)

	a.app.Post(registrationPkg.RegistrationV0MethodPath, a.createUserUseCase.Execute)

	a.app.Post(authPkg.AuthV0MethodPath, a.authUserUsecase.Execute)

	a.app.Post(checkEmailPkg.CheckEmailV0MethodPath, a.checkEmailUsecase.Execute)

	auth := a.app.Group("/", tokenService.AuthMiddleware())

	auth.Post(updateInfoPkg.UpdateUserInfoV0MethodPath, a.updateUserInfoUsecase.Execute)

	auth.Post(changePasswordPkg.ChangePasswordV0MethodPath, a.changePasswordUsecase.Execute)
}
