package updateUserInfoUsecase

import (
	"renal_tracker/pkg/user/updateInfoPkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"

	"renal_tracker/internal/model/userModel"
	_ "renal_tracker/internal/usecase"
)

type UseCase struct {
	updateUserInfo updateUserInfo
}

func New(updateUserInfo updateUserInfo) *UseCase {
	return &UseCase{updateUserInfo: updateUserInfo}
}

//		@Summary	Обновление информации о пользователе
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Param		params	body		updateInfoPkg.UpdateUserInfoV0Request	true	"request"
//		@Success	200		{object}	updateInfoPkg.UpdateUserInfoV0Response
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/user/updateInfo [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "updateUserInfoUsecase").Logger()

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

	user := c.Locals("user").(userModel.User)

	if err := u.updateUserInfo.UpdateUserInfo(c.Context(), req, user.ID, nil); err != nil {
		log.Error().Err(err).Msg("can not update user info")

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
