package calcUsecase

import (
	"database/sql"
	"errors"
	"math"
	"renal_tracker/internal/enum/gfrCurrency"
	"renal_tracker/internal/enum/sex"
	"renal_tracker/internal/model/userModel"
	"renal_tracker/internal/usecase/gfrUsecase"
	"renal_tracker/pkg"
	"renal_tracker/pkg/gfr/calcPkg"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

var (
	ErrSexIsEmpty           = errors.New("sex is empty")
	ErrAgeIsEmpty           = errors.New("age is empty")
	ErrWeightHeightAreEmpty = errors.New("weight or/and height are empty")
)

type UseCase struct {
	findUserByID findUserByID
}

func New(findUserByID findUserByID) *UseCase {
	return &UseCase{
		findUserByID: findUserByID,
	}
}

func (u *UseCase) Execute(c *fiber.Ctx) (err error) {
	log := log.With().Str("layer", "calcUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

	userID := c.Locals("userID").(string)

	req := calcPkg.CalcV0Request{}

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

	if req.Sex == nil || req.Age == nil || (req.IsAbsolute && ((req.Weight == nil || req.Height == nil) && req.BSA == nil)) {
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

	gfr, bsa, age, err := calc(req, user)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	var weight, height *float32
	var sex pkg.Sex
	var testDate time.Time

	if req.Weight == nil || req.Height == nil {
		if user.ID != "" && user.Weight != nil && user.Height != nil {
			weight = user.Weight
			height = user.Height
		}
	} else {
		weight = req.Weight
		height = req.Height
	}

	if req.Sex == nil {
		if user.ID != "" {
			sex = user.Sex.ConvertToPkg()
		} else {
			sex = pkg.Male
		}
	} else {
		sex = *req.Sex
	}

	if req.CreatinineTestDate != nil {
		testDate = *req.CreatinineTestDate
	} else {
		testDate = time.Now()
	}

	gfrMediumStart, gfrMediumEnd, gfrMinimum := gfrUsecase.GetGfrNorms(age)

	if req.IsAbsolute {
		gfrMediumStartFl := float64(gfrMediumStart) * (float64(bsa) / 1.73)
		gfrMediumEndFl := float64(gfrMediumEnd) * (float64(bsa) / 1.73)
		gfrMinimumFl := float64(gfrMinimum) * (float64(bsa) / 1.73)

		gfrMediumStart = uint8(math.Round(gfrMediumStartFl))
		gfrMediumEnd = uint8(math.Round(gfrMediumEndFl))
		gfrMinimum = uint8(math.Round(gfrMinimumFl))
	}

	resp := calcPkg.CalcV0Response{
		Creatinine:         req.Creatinine,
		CreatinineCurrency: req.CreatinineCurrency,
		Weight:             weight,
		Height:             height,
		Sex:                sex,
		BSA:                bsa,
		Age:                age,
		GFR:                gfr,
		GFRCurrency:        gfrCurrency.ML_MIN_M2,
		IsAbsolute:         req.IsAbsolute,
		CreatinineTestDate: testDate,

		GFRMediumStart: gfrMediumStart,
		GFRMediumEnd:   gfrMediumEnd,
		GFRMinimum:     gfrMinimum,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func calc(req calcPkg.CalcV0Request, user userModel.User) (uint8, float32, uint8, error) {
	var k float32
	var alfa float32
	var C float32
	var age float32

	if req.CreatinineCurrency == pkg.MKMOL_L {
		req.Creatinine = req.Creatinine / 88.4
	}

	if req.Sex == nil {
		if user.ID != "" {
			if user.Sex == sex.Male {
				k = 0.9
				alfa = -0.411
				C = 1.159
			} else {
				k = 0.7
				alfa = -0.329
				C = 1.018
			}
		} else {
			return 0, 0, 0, ErrSexIsEmpty
		}
	} else {
		if *req.Sex == pkg.Male {
			k = 0.9
			alfa = -0.411
			C = 1.159
		} else {
			k = 0.7
			alfa = -0.329
			C = 1.018
		}
	}

	if req.Age == nil {
		if user.ID != "" {
			var testDate time.Time

			if req.CreatinineTestDate != nil {
				testDate = *req.CreatinineTestDate
			} else {
				testDate = time.Now()
			}

			age = float32(testDate.Year() - user.Birth.Year())

			if testDate.YearDay() < user.Birth.YearDay() {
				age--
			}
		} else {
			return 0, 0, 0, ErrAgeIsEmpty
		}
	} else {
		age = float32(*req.Age)
	}

	creatinineDivK := req.Creatinine / k

	if creatinineDivK <= 1 {
		creatinineDivK = float32(math.Pow(float64(creatinineDivK), float64(alfa)))
	} else {
		creatinineDivK = float32(math.Pow(float64(creatinineDivK), -1.209))
	}

	gfr := 141 * creatinineDivK * float32(math.Pow(0.993, float64(age))) * C

	var bsa float32 = 1.73

	if req.IsAbsolute {
		if req.BSA != nil {
			bsa = *req.BSA
		} else {
			var weight, height float32

			if req.Weight == nil || req.Height == nil {
				if user.ID != "" && user.Weight != nil && user.Height != nil {
					weight = *user.Weight
					height = *user.Height
				} else {
					return 0, 0, 0, ErrWeightHeightAreEmpty
				}
			} else {
				weight = *req.Weight
				height = *req.Height
			}

			bsa = 0.007184 * float32(math.Pow(float64(weight), 0.428)) * float32(math.Pow(float64(height), 0.725))
		}

		gfr = gfr * (bsa / 1.73)
	}

	gfrUi := uint8(math.Round(float64(gfr)))

	return gfrUi, bsa, uint8(age), nil
}
