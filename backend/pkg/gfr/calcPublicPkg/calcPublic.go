package calcPublicPkg

import (
	"errors"
	"renal_tracker/pkg"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var ErrCanNotCalculateBsa = errors.New("is absolute is true, but bsa and weight and height are empty")

const CalcPublicV0MethodPath = "/api/gfr/calcPublic"

type CalcPublicV0Request struct {
	Creatinine         float32                `json:"creatinine" binding:"required"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency" binding:"required"`
	Weight             *float32               `json:"weight,omitempty"`
	Height             *float32               `json:"height,omitempty"`
	Sex                pkg.Sex                `json:"sex" binding:"required"`
	BSA                *float32               `json:"bsa,omitempty"`
	Age                uint8                  `json:"age" binding:"required"`
	IsAbsolute         bool                   `json:"isAbsolute" binding:"required"`
}

type CalcPublicV0Response struct {
	Creatinine         float32                `json:"creatinine" binding:"required"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency" binding:"required"`
	Weight             *float32               `json:"weight"`
	Height             *float32               `json:"height"`
	Sex                pkg.Sex                `json:"sex" binding:"required"`
	BSA                float32                `json:"bsa" binding:"required"`
	Age                uint8                  `json:"age" binding:"required"`
	GFR                uint8                  `json:"gfr" binding:"required"`
	GFRCurrency        pkg.GFRCurrency        `json:"gfrCurrency" binding:"required"`
	IsAbsolute         bool                   `json:"isAbsolute" binding:"required"`

	GFRMediumStart uint8 `json:"gfrMediumStart" binding:"required"`
	GFRMediumEnd   uint8 `json:"gfrMediumEnd" binding:"required"`
	GFRMinimum     uint8 `json:"gfrMinimum" binding:"required"`
}

func (c CalcPublicV0Request) Validate() error {
	err := c.CreatinineCurrency.Validate()
	if err != nil {
		return err
	}

	err = c.Sex.Validate()
	if err != nil {
		return err
	}

	if c.IsAbsolute {
		if c.BSA == nil && (c.Weight == nil || c.Height == nil) {
			return ErrCanNotCalculateBsa
		}
	}

	return validation.ValidateStruct(
		&c,
		validation.Field(&c.Creatinine, validation.Required),
		validation.Field(&c.Age, validation.Required),
	)
}
