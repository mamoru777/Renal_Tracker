package createUserUsecase

import (
	"database/sql"
	"errors"
	"renal_tracker/cfg"
	"renal_tracker/pkg/user/registrationPkg"
	"renal_tracker/tools/passwordManager"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"

	_ "renal_tracker/internal/usecase"
)

var (
	ErrUserExists = errors.New("User with this email already exists")
)

type UseCase struct {
	createUser      createUser
	findUserByEmail findUserByEmail
}

func New(createUser createUser, findUserByEmail findUserByEmail) *UseCase {
	return &UseCase{
		createUser:      createUser,
		findUserByEmail: findUserByEmail,
	}
}

//		@Summary	Регистрация пользователей
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param		params	body		registrationPkg.RegistrationV0Request	true	"request"
//		@Success	200		{object}	registrationPkg.RegistrationV0Response
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/user/reg [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "createUserUsecase").Logger()

	req := registrationPkg.RegistrationV0Request{}

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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": ErrUserExists,
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
		[]byte(req.Password),
		[]byte(cfg.Load().Auth.GeneralSalt),
		passwordSalt,
	)
	if err != nil {
		log.Error().Err(err).Msg("can not create new password")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id, err := u.createUser.CreateUser(c.Context(), req, passwordHash, passwordSalt)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := registrationPkg.RegistrationV0Response{
		ID: id,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
