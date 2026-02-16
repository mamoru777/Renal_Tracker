package checkEmailPkg

import (
	"errors"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

var (
	ErrNewPassEqualToNew = errors.New("new pass is equal to new")
)

const CheckEmailV0MethodPath = "/api/user/checkEmail"

type CheckEmailV0Request struct {
	Email string `json:"email"`
}

type CheckEmailV0Response struct {
	IsExists bool `json:"isExists"`
}

func (r CheckEmailV0Request) Validate() error {
	return validation.ValidateStruct(
		&r,
		validation.Field(&r.Email, validation.Required, is.Email),
	)
}
