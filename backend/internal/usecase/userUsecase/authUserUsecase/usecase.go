package authUserUsecase

import (
	"context"
	"database/sql"
	"errors"
	"renal_tracker/cfg"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/user/authPkg"
	"renal_tracker/pkg/user/updateInfoPkg"
	jwtManager "renal_tracker/tools/jwt"
	"renal_tracker/tools/passwordManager"
	"renal_tracker/tools/pointer"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"

	_ "renal_tracker/internal/usecase"
)

var (
	ErrNoUser                 = errors.New("No such user with this email")
	ErrInvalidEmailOrPassword = errors.New("Invalid email or password")
)

type UseCase struct {
	findUserByEmail findUserByEmail
	updateUserInfo  updateUserInfo
}

func New(findUserByEmail findUserByEmail, updateUserInfo updateUserInfo) *UseCase {
	return &UseCase{
		findUserByEmail: findUserByEmail,
		updateUserInfo:  updateUserInfo,
	}
}

//		@Summary	Аутентификация пользователей
//		@Tags		users
//	 	@Accept 	json
//		@Produce	json
//		@Param		params	body		usecase.Json{data=authPkg.AuthV0Request}	true	"request"
//		@Success	200		{object}	usecase.Json{data=authPkg.AuthV0Response}
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/user/auth [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "authUserUsecase").Logger()

	req := authPkg.AuthV0Request{}

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
		if errors.Is(err, sql.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": ErrNoUser,
			})
		}

		log.Error().Err(err).Msg("can not find user by email")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	if user.ID == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ErrNoUser,
		})
	}

	if err := passwordManager.CompareHashAndPassword(user.PasswordHash, []byte(req.Password), user.PasswordSalt, []byte(cfg.Load().Auth.GeneralSalt)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": ErrInvalidEmailOrPassword,
		})
	}

	if err := u.updateUserInfo.UpdateUserInfo(c.Context(), updateInfoPkg.UpdateUserInfoV0Request{}, user.ID, pointer.Pointer(time.Now())); err != nil {
		log.Error().Err(err).Msg("can not update user info")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	accessToken, refreshToken, err := createPairTokens(c.Context(), user.ID)
	if err != nil {
		log.Error().Err(err).Msg("can not create pair tokens")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := authPkg.AuthV0Response{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func createPairTokens(ctx context.Context, id string) (string, string, error) {
	claims := userModel.CustomClaims{
		UserID: id,
	}

	accessToken, err := jwtManager.GenerateToken(ctx, jwtManager.AccessToken, claims)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := jwtManager.GenerateToken(ctx, jwtManager.RefreshToken, claims)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}
