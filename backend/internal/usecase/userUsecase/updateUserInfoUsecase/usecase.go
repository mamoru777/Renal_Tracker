package updateUserInfoUsecase

import (
	"renal_tracker/pkg/user/updateInfoPkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type UseCase struct {
	updateUserInfo updateUserInfo
	findUserByID   findUserByID
}

func New(updateUserInfo updateUserInfo, findUserByID findUserByID) *UseCase {
	return &UseCase{
		updateUserInfo: updateUserInfo,
		findUserByID:   findUserByID,
	}
}

func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "updateUserInfoUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

	req := updateInfoPkg.UpdateUserInfoV0Request{}

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

	if err := u.updateUserInfo.UpdateUserInfo(c.Context(), req, userID, nil); err != nil {
		log.Error().Err(err).Msg("can not update user info")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	user, err := u.findUserByID.FindUserByID(c.Context(), userID)
	if err != nil {
		log.Error().Err(err).Msg("can not find user by id")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := updateInfoPkg.UpdateUserInfoV0Response{
		Email:      user.Email,
		Name:       user.Name,
		Surname:    user.Surname,
		Patronymic: user.Patronymic,
		DateBirth:  user.Birth,
		Sex:        user.Sex.ConvertToPkg(),
		Weight:     user.Weight,
		Height:     user.Height,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
