package calcPublicUsecase

import (
	"math"
	"renal_tracker/internal/enum/gfrCurrency"
	"renal_tracker/internal/usecase/gfrUsecase"
	"renal_tracker/pkg"
	"renal_tracker/pkg/gfr/calcPublicPkg"

	"github.com/gofiber/fiber/v2"
)

type UseCase struct{}

func New() *UseCase {
	return &UseCase{}
}

func (u *UseCase) Execute(c *fiber.Ctx) error {
	req := calcPublicPkg.CalcPublicV0Request{}

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

	gfr, bsa := calc(req)

	gfrMediumStart, gfrMediumEnd, gfrMinimum := gfrUsecase.GetGfrNorms(req.Age)

	if req.IsAbsolute {
		gfrMediumStartFl := float64(gfrMediumStart) * (float64(bsa) / 1.73)
		gfrMediumEndFl := float64(gfrMediumEnd) * (float64(bsa) / 1.73)
		gfrMinimumFl := float64(gfrMinimum) * (float64(bsa) / 1.73)

		gfrMediumStart = uint8(math.Round(gfrMediumStartFl))
		gfrMediumEnd = uint8(math.Round(gfrMediumEndFl))
		gfrMinimum = uint8(math.Round(gfrMinimumFl))
	}

	resp := calcPublicPkg.CalcPublicV0Response{
		Creatinine:         req.Creatinine,
		CreatinineCurrency: req.CreatinineCurrency,
		Weight:             req.Weight,
		Height:             req.Height,
		Sex:                req.Sex,
		BSA:                bsa,
		Age:                req.Age,
		GFR:                gfr,
		GFRCurrency:        gfrCurrency.ML_MIN_M2,
		IsAbsolute:         req.IsAbsolute,

		GFRMediumStart: gfrMediumStart,
		GFRMediumEnd:   gfrMediumEnd,
		GFRMinimum:     gfrMinimum,
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func calc(req calcPublicPkg.CalcPublicV0Request) (uint8, float32) {
	var k float32
	var alfa float32
	var C float32

	if req.CreatinineCurrency == pkg.MKMOL_L {
		req.Creatinine = req.Creatinine / 88.4
	}

	if req.Sex == pkg.Male {
		k = 0.9
		alfa = -0.411
		C = 1.159
	} else {
		k = 0.7
		alfa = -0.329
		C = 1.018
	}

	creatinineDivK := req.Creatinine / k

	if creatinineDivK <= 1 {
		creatinineDivK = float32(math.Pow(float64(creatinineDivK), float64(alfa)))
	} else {
		creatinineDivK = float32(math.Pow(float64(creatinineDivK), -1.209))
	}

	gfr := 141 * creatinineDivK * float32(math.Pow(0.993, float64(req.Age))) * C

	var bsa float32 = 1.73

	if req.IsAbsolute {
		if req.BSA != nil {
			bsa = *req.BSA
		} else {
			var weight, height float32

			if req.Weight != nil && req.Height != nil {
				weight = *req.Weight
				height = *req.Height
			}

			bsa = 0.007184 * float32(math.Pow(float64(weight), 0.428)) * float32(math.Pow(float64(height), 0.725))
		}

		gfr = gfr * (bsa / 1.73)
	}

	gfrUi := uint8(math.Round(float64(gfr)))

	return gfrUi, bsa
}
