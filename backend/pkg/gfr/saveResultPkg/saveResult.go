package saveResultPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

const SaveResultV0MethodPath = "/api/gfr/saveResult"

type SaveResultV0Request struct {
	Creatinine         *float32                `json:"creatinine"`
	CreatinineCurrency *pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32                `json:"weight"`
	Height             *float32                `json:"height"`
	Sex                *pkg.Sex                `json:"sex"`
	BSA                *float32                `json:"bsa"`
	Age                *uint8                  `json:"age"`
	GFR                uint8                   `json:"gfr"`
	GFRCurrency        *pkg.GFRCurrency        `json:"gfrCurrency"`
	IsAbsolute         *bool                   `json:"isAbsolute"`
	CreatinineTestDate time.Time               `json:"creatinineTestDate"`

	GFRMediumStart *uint8 `json:"gfrMediumStart"`
	GFRMediumEnd   *uint8 `json:"gfrMediumEnd"`
	GFRMinimum     *uint8 `json:"gfrMinimum"`
}

type SaveResultV0Response struct {
	ID string `json:"id"`
}

func (s SaveResultV0Request) Validate() error {
	if s.CreatinineCurrency != nil {
		err := s.CreatinineCurrency.Validate()
		if err != nil {
			return err
		}
	}

	if s.Sex != nil {
		err := s.Sex.Validate()
		if err != nil {
			return err
		}
	}

	if s.GFRCurrency != nil {
		err := s.GFRCurrency.Validate()
		if err != nil {
			return err
		}
	}

	return validation.ValidateStruct(
		&s,
		validation.Field(&s.GFR, validation.Required),
		validation.Field(&s.CreatinineTestDate, validation.Required),
	)
}
