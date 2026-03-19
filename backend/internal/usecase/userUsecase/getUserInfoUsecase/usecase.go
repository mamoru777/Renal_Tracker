package getUserInfoUsecase

import (
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/user/getUserInfoPkg"

	"github.com/gofiber/fiber/v2"
)

type UseCase struct{}

func New() *UseCase {
	return &UseCase{}
}

//		@Summary	Получение информации о пользователе
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Success	200		{object}	getUserInfoPkg.GetUserInfoV0Response
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/user/me [get]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	user := c.Locals("user").(userModel.User)

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
