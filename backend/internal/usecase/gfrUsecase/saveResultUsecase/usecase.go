package saveResultUsecase

import (
	"database/sql"
	"errors"
	"math"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/internal/usecase/gfrUsecase"
	"renal_tracker/pkg"
	"renal_tracker/pkg/gfr/saveResultPkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

var (
	ErrWeightHeightAreEmpty = errors.New("weight or/and height are empty")
)

type UseCase struct {
	findUserByID    findUserByID
	createGfrResult createGfrResult
}

func New(findUserByID findUserByID, createGfrResult createGfrResult) *UseCase {
	return &UseCase{
		findUserByID:    findUserByID,
		createGfrResult: createGfrResult,
	}
}

//		@Summary	Сохранить результат рассчета (только для авторизованных)
//		@Tags		gfr
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Param 		Cookie 			header 		string 		true 		"Refresh token cookie" 		default 	"refreshToken=<token>"
//		@Param		params	body		saveResultPkg.SaveResultV0Request	true	"request"
//		@Success	200		{object}	saveResultPkg.SaveResultV0Response
//		@Header 	200 	{string} 	accessToken "Новый access token"
//		@Header 	200 	{string} 	refreshToken "Новый refresh token"
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Header 	400 	{string} 	accessToken "Новый access token"
//		@Header 	400 	{string} 	refreshToken "Новый refresh token"
//		@Failure	404		{object}	usecase.ErrorResponse
//		@Header 	404 	{string} 	accessToken "Новый access token"
//		@Header 	404 	{string} 	refreshToken "Новый refresh token"
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Header 	500 	{string} 	accessToken "Новый access token"
//		@Header 	500 	{string} 	refreshToken "Новый refresh token"
//		@Router		/api/gfr/saveResult [post]
func (u *UseCase) Execute(c *fiber.Ctx) (err error) {
	log := log.With().Str("layer", "saveResultUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

	userID := c.Locals("userID").(string)

	req := saveResultPkg.SaveResultV0Request{}

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

	user := userModel.User{}

	if req.Sex == nil || req.Age == nil || (req.IsAbsolute != nil && *req.IsAbsolute && ((req.Weight == nil || req.Height == nil) && req.BSA == nil)) {
		user, err = u.findUserByID.FindUserByID(c.Context(), userID)
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
	}

	if user.ID != "" {
		if req.Sex == nil {
			req.Sex = (*pkg.Sex)(&user.Sex)
		}

		if req.Age == nil {

			age := req.CreatinineTestDate.Year() - user.Birth.Year()

			if req.CreatinineTestDate.YearDay() < user.Birth.YearDay() {
				age--
			}

			ageUint8 := uint8(age)

			req.Age = &ageUint8
		}
	}

	if req.IsAbsolute != nil {
		if req.BSA == nil {
			if *req.IsAbsolute {
				var weight, height float32

				if req.Weight == nil || req.Height == nil {
					if user.Weight != nil && user.Height != nil {
						weight = *user.Weight
						height = *user.Height
					} else {
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"error": ErrWeightHeightAreEmpty.Error(),
						})

					}
				} else {
					weight = *req.Weight
					height = *req.Height
				}

				var bsa float32 = 0.007184 * float32(math.Pow(float64(weight), 0.428)) * float32(math.Pow(float64(height), 0.725))
				req.BSA = &bsa
			} else {
				var bsa float32 = 1.73
				req.BSA = &bsa
			}
		}
	}

	if req.GFRMediumStart == nil || req.GFRMediumEnd == nil || req.GFRMinimum == nil {
		gfrMediumStart, gfrMediumEnd, gfrMinimum := gfrUsecase.GetGfrNorms(*req.Age)

		if req.IsAbsolute != nil && *req.IsAbsolute {
			gfrMediumStartFl := float64(gfrMediumStart) * (float64(*req.BSA) / 1.73)
			gfrMediumEndFl := float64(gfrMediumEnd) * (float64(*req.BSA) / 1.73)
			gfrMinimumFl := float64(gfrMinimum) * (float64(*req.BSA) / 1.73)

			gfrMediumStart = uint8(math.Round(gfrMediumStartFl))
			gfrMediumEnd = uint8(math.Round(gfrMediumEndFl))
			gfrMinimum = uint8(math.Round(gfrMinimumFl))
		}

		if req.GFRMediumStart == nil {
			req.GFRMediumStart = &gfrMediumStart
		}

		if req.GFRMediumEnd == nil {
			req.GFRMediumEnd = &gfrMediumEnd
		}

		if req.GFRMinimum == nil {
			req.GFRMinimum = &gfrMinimum
		}
	}

	resultID, err := u.createGfrResult.CreateGfrResult(c.Context(), req, userID)
	if err != nil {
		log.Error().Err(err).Msg("can not create gfr result")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	resp := saveResultPkg.SaveResultV0Response{
		ID: resultID,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
