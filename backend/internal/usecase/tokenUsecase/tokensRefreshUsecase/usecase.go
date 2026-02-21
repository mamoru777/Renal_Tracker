package tokensRefreshUsecase

import (
	"context"
	"errors"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/pkg/token/tokensRefreshPkg"
	jwtManager "renal_tracker/tools/jwt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type UseCase struct {
}

func New() *UseCase {
	return &UseCase{}
}

//		@Summary	Обновление пары токенов
//		@Tags		tokens
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Cookie 			header 		string 		true 		"Refresh token cookie" 		default 	"refreshToken=<token>"
//		@Param		params	body		tokensRefreshPkg.TokensRefreshV0Request		true	"request"
//		@Success	200		{object}	tokensRefreshPkg.TokensRefreshV0Response
//		@Failure	401		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/tokens/refresh [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "tokensRefreshUsecase").Logger()

	refreshToken := c.Cookies("refreshToken")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).
			JSON(fiber.Map{"error": "refresh token is empty"})
	}

	refreshClaims, err := jwtManager.ParseToken[userModel.CustomClaims](c.Context(), refreshToken)
	if err != nil {
		var validationError *jwt.ValidationError

		if errors.As(err, &validationError) {
			if validationError.Errors == jwt.ValidationErrorExpired {
				return c.Status(fiber.StatusUnauthorized).
					JSON(fiber.Map{"error": "refresh token is expired"})
			}
		}
		log.Error().Err(err).Msg("can not parse refresh token")

		return c.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"error": "can not parse refresh token"})
	}

	if refreshClaims.UserID == "" {
		return c.Status(fiber.StatusUnauthorized).
			JSON(fiber.Map{"error": "user id is empty"})
	}

	accessToken, refreshToken, err := createPairTokens(c.Context(), refreshClaims.UserID)
	if err != nil {
		log.Error().Err(err).Msg("can not create pair tokens")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := tokensRefreshPkg.TokensRefreshV0Response{
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
