package saveResultPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

const SaveResultV0MethodPath = "/api/gfr/saveResult"

type SaveResultV0Request struct {
	Creatinine         *float32                `json:"creatinine,omitempty"`
	CreatinineCurrency *pkg.CreatinineCurrency `json:"creatinineCurrency,omitempty"`
	Weight             *float32                `json:"weight,omitempty"`
	Height             *float32                `json:"height,omitempty"`
	Sex                *pkg.Sex                `json:"sex,omitempty"`
	BSA                *float32                `json:"bsa,omitempty"`
	Age                *uint8                  `json:"age,omitempty"`
	GFR                uint8                   `json:"gfr" binding:"required"`
	GFRCurrency        *pkg.GFRCurrency        `json:"gfrCurrency,omitempty"`
	IsAbsolute         *bool                   `json:"isAbsolute,omitempty"`
	CreatinineTestDate time.Time               `json:"creatinineTestDate" binding:"required"`

	GFRMediumStart *uint8 `json:"gfrMediumStart,omitempty"`
	GFRMediumEnd   *uint8 `json:"gfrMediumEnd,omitempty"`
	GFRMinimum     *uint8 `json:"gfrMinimum,omitempty"`
}

type SaveResultV0Response struct {
	ID string `json:"id" binding:"required"`
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
