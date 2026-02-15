package checkEmailUsecase

import (
	"database/sql"
	"errors"
	"renal_tracker/pkg/user/checkEmailPkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

var (
	ErrUserExists = errors.New("User with this email already exists")
)

type UseCase struct {
	findUserByEmail findUserByEmail
}

func New(findUserByEmail findUserByEmail) *UseCase {
	return &UseCase{
		findUserByEmail: findUserByEmail,
	}
}

func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "checkEmailUsecase").Logger()

	req := checkEmailPkg.CheckEmailV0Request{}

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

	resp := checkEmailPkg.CheckEmailV0Response{IsExists: false}

	//TODO проверить, что возвращает этот метод, если пользователя не существует, ошибку или пустого пользователя без ошибки
	user, err := u.findUserByEmail.FindUserByEmail(c.Context(), req.Email)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			log.Error().Err(err).Msg("can not find user by email")

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err,
			})
		}
	}

	if user.ID != "" {
		resp.IsExists = true
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
