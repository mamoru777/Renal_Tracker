package authPkg

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

const AuthV0MethodPath = "/user/auth"

type AuthV0Request struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthV0Response struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (r AuthV0Request) Validate() error {
	return validation.ValidateStruct(
		&r,
		validation.Field(&r.Email, validation.Required, is.Email),
		validation.Field(&r.Password, validation.Required, validation.Length(6, 0)),
	)
}
