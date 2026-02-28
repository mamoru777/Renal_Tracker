package calcPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

const CalcV0MethodPath = "/api/gfr/calc"

type CalcV0Request struct {
	Creatinine         float32                `json:"creatinine"`
	CreatinineCurrency pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32               `json:"weight"`
	Height             *float32               `json:"height"`
	Sex                *pkg.Sex               `json:"sex"`
	BSA                *float32               `json:"bsa"`
	Age                *uint8                 `json:"age"`
	IsAbsolute         bool                   `json:"isAbsolute"`
	CreatinineTestDate *time.Time             `json:"creatinineTestDate"`
}

type CalcV0Response struct {
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
	CreatinineTestDate time.Time              `json:"creatinineTestDate"`

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
