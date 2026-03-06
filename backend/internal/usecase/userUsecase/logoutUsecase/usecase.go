package logoutUsecase

import (
	_ "renal_tracker/pkg/user/logoutPkg"
	"time"

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
	accessCookie := fiber.Cookie{
		Name:     "accessToken",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		Path:     "/",
	}
	refreshCookie := fiber.Cookie{
		Name:     "refreshToken",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		Path:     "/",
	}

	c.Cookie(&accessCookie)
	c.Cookie(&refreshCookie)

	return c.SendStatus(200)
}
