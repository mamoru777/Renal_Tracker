package tokenService

import (
	"database/sql"
	"errors"
	"renal_tracker/internal/model/userModel"
	jwtManager "renal_tracker/tools/jwt"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog/log"
)

type TokenService struct {
	findUserByID findUserByID
	getUser      getUser
	setUser      setUser
}

func New(
	findUserByID findUserByID,
	getUser getUser,
	setUser setUser,
) *TokenService {
	return &TokenService{
		findUserByID: findUserByID,
		getUser:      getUser,
		setUser:      setUser,
	}
}

func (t *TokenService) AuthMiddleware() fiber.Handler {
	log := log.With().Str("layer", "token service").Logger()

	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		var accessToken string
		var accessClaims userModel.CustomClaims

		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "empty auth header"})
		}

		split := strings.Split(authHeader, " ")
		if len(split) != 2 || split[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "invalid auth header format"})
		}

		accessToken = split[1]

		if accessToken == "" {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "empty access token"})
		}

		accessClaims, err := jwtManager.ParseToken[userModel.CustomClaims](c.Context(), accessToken)
		if err != nil {
			var validationError *jwt.ValidationError

			if errors.As(err, &validationError) {
				if validationError.Errors == jwt.ValidationErrorExpired {
					return c.Status(fiber.StatusUnauthorized).
						JSON(fiber.Map{"error": "access token is expired"})
				}
			}
			log.Error().Err(err).Msg("can not parse access token")

			return c.Status(fiber.StatusInternalServerError).
				JSON(fiber.Map{"error": "can not parse access token"})
		}

		if accessClaims.UserID == "" {
			return c.Status(fiber.StatusUnauthorized).
				JSON(fiber.Map{"error": "user id is empty"})
		}

		user, err := t.getUser.GetUser(c.Context(), accessClaims.UserID)
		if err != nil {
			if !errors.Is(err, redis.Nil) {
				log.Error().Err(err).Msg("can not get user from cache")

				return c.Status(fiber.StatusInternalServerError).
					JSON(fiber.Map{"error": "can not get user from cache"})
			}
		} else {
			c.Locals("user", user)

			return c.Next()
		}

		user, err = t.findUserByID.FindUserByID(c.Context(), accessClaims.UserID)
		if err != nil {
			log.Error().Err(err).Msg("can not find user by id")

			if errors.Is(err, sql.ErrNoRows) {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "can not find user by id",
				})
			}

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "can not find user by id",
			})
		}

		err = t.setUser.SetUser(c.Context(), user)
		if err != nil {
			log.Error().Err(err).Msg("can not set user to cache")

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "can not set user to cache",
			})
		}

		c.Locals("user", user)

		return c.Next()
	}
}
