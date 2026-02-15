package registrationPkg

import (
	"renal_tracker/pkg"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

const RegistrationV0MethodPath = "/user/reg"

type RegistrationV0Request struct {
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	Name       string    `json:"name"`
	Surname    string    `json:"surname"`
	Patronymic *string   `json:"patronymic"`
	DateBirth  time.Time `json:"dateBirth"`
	Sex        pkg.Sex   `json:"sex"`
	Weight     *float32  `json:"weight"`
	Height     *float32  `json:"height"`
}

type RegistrationV0Response struct {
	ID string `json:"id"`
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
