package changePasswordUsecase

import (
	"errors"
	"renal_tracker/cfg"
	"renal_tracker/pkg/user/changePasswordPkg"
	"renal_tracker/tools/passwordManager"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"

	"renal_tracker/internal/model/userModel"
	_ "renal_tracker/internal/usecase"
)

var (
	ErrInvalidEmailOrPassword = errors.New("Invalid old password")
)

type UseCase struct {
	changePassword changePassword
}

func New(changePassword changePassword) *UseCase {
	return &UseCase{}
}

//		@Summary	Смена пароля
//		@Tags		users
//	 	@Accept json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" 	default "Bearer <token>"
//		@Param		params	body		changePasswordPkg.ChangePasswordV0Request	true	"request"
//		@Success	200		{object}	changePasswordPkg.ChangePasswordV0Response
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/user/changePassword [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "changePasswordUsecase").Logger()

	req := changePasswordPkg.ChangePasswordV0Request{}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := req.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	user := c.Locals("user").(userModel.User)

	if err := passwordManager.CompareHashAndPassword(user.PasswordHash, []byte(req.OldPassword), user.PasswordSalt, []byte(cfg.Load().Auth.GeneralSalt)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": ErrInvalidEmailOrPassword,
		})
	}

	passwordSalt, err := passwordManager.GenerateRandomSalt()
	if err != nil {
		log.Error().Err(err).Msg("can not generate random salt")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	passwordHash, err := passwordManager.CreateNewPassword(
		[]byte(req.NewPassword),
		[]byte(cfg.Load().Auth.GeneralSalt),
		passwordSalt,
	)
	if err != nil {
		log.Error().Err(err).Msg("can not create new password")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := u.changePassword.ChangePassword(c.Context(), user.ID, passwordHash, passwordSalt); err != nil {
		log.Error().Err(err).Msg("can not change password")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusOK)
}
