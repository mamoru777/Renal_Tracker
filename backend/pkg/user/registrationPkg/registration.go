package registrationPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

const RegistrationV0MethodPath = "/api/user/reg"

type RegistrationV0Request struct {
	Email      string    `json:"email" binding:"required"`
	Password   string    `json:"password" binding:"required"`
	Name       string    `json:"name" binding:"required"`
	Surname    string    `json:"surname" binding:"required"`
	Patronymic *string   `json:"patronymic,omitempty"`
	DateBirth  time.Time `json:"dateBirth" binding:"required"`
	Sex        pkg.Sex   `json:"sex" binding:"required"`
	Weight     *float32  `json:"weight,omitempty"`
	Height     *float32  `json:"height,omitempty"`
}

type RegistrationV0Response struct {
	ID string `json:"id" binding:"required"`
}

func (r RegistrationV0Request) Validate() error {
	if err := r.Sex.Validate(); err != nil {
		return err
	}

	return validation.ValidateStruct(
		&r,
		validation.Field(&r.Email, validation.Required, is.Email),
		validation.Field(&r.Password, validation.Required, validation.Length(6, 72)),
		validation.Field(&r.Name, validation.Required),
		validation.Field(&r.Surname, validation.Required),
		validation.Field(&r.DateBirth, validation.Required),
		validation.Field(&r.Sex, validation.Required),
	)
}
