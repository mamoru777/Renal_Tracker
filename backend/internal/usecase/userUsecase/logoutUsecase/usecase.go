package logoutUsecase

import (
	_ "renal_tracker/pkg/user/logoutPkg"

	"github.com/gofiber/fiber/v2"
)

type UseCase struct {
}

func New() *UseCase {
	return &UseCase{}
}

//		@Summary	Выход пользователя из системы
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Param		params	body		logoutPkg.LogoutV0MethodPathV0Request	true	"request"
//		@Success	200		{object}	logoutPkg.LogoutV0MethodPathV0Response
//		@Router		/api/user/logout [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	c.ClearCookie("accessToken", "refreshToken")

	return c.SendStatus(200)
}
