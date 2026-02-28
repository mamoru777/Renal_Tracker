package calcPublicPkg

import (
	"errors"
	"renal_tracker/pkg"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var ErrCanNotCalculateBsa = errors.New("is absolute is true, but bsa and weight and height are empty")

const CalcPublicV0MethodPath = "/api/gfr/calcPublic"

type CalcPublicV0Request struct {
	Creatinine         float32                `json:"creatinine"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32               `json:"weight"`
	Height             *float32               `json:"height"`
	Sex                pkg.Sex                `json:"sex"`
	BSA                *float32               `json:"bsa"`
	Age                uint8                  `json:"age"`
	IsAbsolute         bool                   `json:"isAbsolute"`
}

type CalcPublicV0Response struct {
	Creatinine         float32                `json:"creatinine"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32               `json:"weight"`
	Height             *float32               `json:"height"`
	Sex                pkg.Sex                `json:"sex"`
	BSA                float32                `json:"bsa"`
	Age                uint8                  `json:"age"`
	GFR                uint8                  `json:"gfr"`
	GFRCurrency        pkg.GFRCurrency        `json:"gfrCurrency"`
	IsAbsolute         bool                   `json:"isAbsolute"`

	GFRMediumStart uint8 `json:"gfrMediumStart"`
	GFRMediumEnd   uint8 `json:"gfrMediumEnd"`
	GFRMinimum     uint8 `json:"gfrMinimum"`
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
