package tokenService

import (
	"renal_tracker/internal/model/userModel"
	jwtManager "renal_tracker/tools/jwt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func AuthMiddleware() fiber.Handler {
	log := log.With().Str("layer", "token service").Logger()

	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		var accessToken string
		var accessClaims userModel.CustomClaims

		if authHeader != "" {
			split := strings.Split(authHeader, " ")
			if len(split) != 2 || split[0] != "Bearer" {
				return c.Status(fiber.StatusUnauthorized).
					JSON(fiber.Map{"error": "invalid authorization format"})
			}

			accessToken = split[1]

			accessClaims, _ = jwtManager.ParseToken[userModel.CustomClaims](c.Context(), accessToken)
		}

		refreshToken := c.Cookies("refreshToken")
		if refreshToken == "" {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "refresh token is empty"})
		}

		refreshClaims, err := jwtManager.ParseToken[userModel.CustomClaims](c.Context(), refreshToken)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "refresh token is expired"})
		}

		if accessClaims.UserID != "" {
			if accessClaims.UserID != refreshClaims.UserID {
				return c.Status(fiber.StatusUnauthorized).
					JSON(fiber.Map{"error": "userIDs in tokens are different"})
			}
		}

		if accessToken == "" {
			claims := userModel.CustomClaims{
				UserID: refreshClaims.UserID,
			}

			accessToken, err = jwtManager.GenerateToken(c.Context(), jwtManager.AccessToken, claims)
			if err != nil {
				log.Error().Err(err).Msg("can not generate token")

				return c.Status(fiber.StatusInternalServerError).
					JSON(fiber.Map{"error": err.Error()})
			}

			refreshToken, err = jwtManager.GenerateToken(c.Context(), jwtManager.RefreshToken, claims)
			if err != nil {
				log.Error().Err(err).Msg("can not generate token")

				return c.Status(fiber.StatusInternalServerError).
					JSON(fiber.Map{"error": err.Error()})
			}
		}

		c.Locals("userID", refreshClaims.UserID)
		c.Locals("accessToken", accessToken)
		c.Locals("refreshToken", refreshToken)

		return c.Next()
	}
}
