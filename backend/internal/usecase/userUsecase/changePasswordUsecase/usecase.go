package changePasswordUsecase

import (
	"errors"
	"renal_tracker/cfg"
	"renal_tracker/pkg/user/changePasswordPkg"
	"renal_tracker/tools/passwordManager"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

var (
	ErrNoUser                 = errors.New("No such user with this email")
	ErrInvalidEmailOrPassword = errors.New("Invalid old password")
)

type UseCase struct {
	findUserByID   findUserByID
	changePassword changePassword
}

func New(findUserByID findUserByID, changePassword changePassword) *UseCase {
	return &UseCase{
		findUserByID:   findUserByID,
		changePassword: changePassword,
	}
}

func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "changePasswordUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

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

	userID := c.Locals("userID").(string)

	user, err := u.findUserByID.FindUserByID(c.Context(), userID)
	if err != nil {
		log.Error().Err(err).Msg("can not find user by id")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if user.ID == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ErrNoUser,
		})
	}

	if err := passwordManager.CompareHashAndPassword(user.PasswordHash, []byte(req.OldPassword), user.PasswordSalt, []byte("")); err != nil {
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

	if err := u.changePassword.ChangePassword(c.Context(), userID, passwordHash, passwordSalt); err != nil {
		log.Error().Err(err).Msg("can not change password")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusOK)
}
