package calcPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

const CalcV0MethodPath = "/api/gfr/calc"

type CalcV0Request struct {
	Creatinine         float32                `json:"creatinine" binding:"required"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency" binding:"required"`
	Weight             *float32               `json:"weight,omitempty"`
	Height             *float32               `json:"height,omitempty"`
	Sex                *pkg.Sex               `json:"sex,omitempty"`
	BSA                *float32               `json:"bsa,omitempty"`
	Age                *uint8                 `json:"age,omitempty"`
	IsAbsolute         bool                   `json:"isAbsolute" binding:"required"`
	CreatinineTestDate *time.Time             `json:"creatinineTestDate,omitempty"`
}

type CalcV0Response struct {
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
	CreatinineTestDate time.Time              `json:"creatinineTestDate" binding:"required"`

	GFRMediumStart uint8 `json:"gfrMediumStart"`
	GFRMediumEnd   uint8 `json:"gfrMediumEnd"`
	GFRMinimum     uint8 `json:"gfrMinimum"`
}

func (c CalcV0Request) Validate() error {
	err := c.CreatinineCurrency.Validate()
	if err != nil {
		return err
	}

	if c.Sex != nil {
		err := c.Sex.Validate()
		if err != nil {
			return err
		}
	}

	return validation.ValidateStruct(
		&c,
		validation.Field(&c.Creatinine, validation.Required),
	)
}
