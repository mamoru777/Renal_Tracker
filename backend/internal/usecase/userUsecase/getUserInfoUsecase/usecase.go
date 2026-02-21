package getUserInfoUsecase

import (
	"database/sql"
	"errors"
	"renal_tracker/pkg/user/getUserInfoPkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type UseCase struct {
	findUserByID findUserByID
}

func New(findUserByID findUserByID) *UseCase {
	return &UseCase{
		findUserByID: findUserByID,
	}
}

//		@Summary	Получение информации о пользователе
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Param 		Cookie 			header 		string 		true 		"Refresh token cookie" 		default 	"refreshToken=<token>"
//		@Success	200		{object}	getUserInfoPkg.GetUserInfoV0Response
//		@Header 	200 	{string} 	accessToken "Новый access token"
//		@Header 	200 	{string} 	refreshToken "Новый refresh token"
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Header 	404 	{string} 	accessToken "Новый access token"
//		@Header 	404 	{string} 	refreshToken "Новый refresh token"
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Header 	500 	{string} 	accessToken "Новый access token"
//		@Header 	500 	{string} 	refreshToken "Новый refresh token"
//		@Router		/api/user/me [get]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "getUserInfoUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

	userID := c.Locals("userID").(string)

	user, err := u.findUserByID.FindUserByID(c.Context(), userID)
	if err != nil {
		log.Error().Err(err).Msg("can not find user by id")

		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := getUserInfoPkg.GetUserInfoV0Response{
		ID:         user.ID,
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
