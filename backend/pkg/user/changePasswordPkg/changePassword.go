package changePasswordPkg

import (
	"errors"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var (
	ErrNewPassEqualToNew = errors.New("new pass is equal to new")
)

const ChangePasswordV0MethodPath = "/api/user/changePassword"

type ChangePasswordV0Request struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

type ChangePasswordV0Response struct{}

func (r ChangePasswordV0Request) Validate() error {
	if r.NewPassword == r.OldPassword {
		return ErrNewPassEqualToNew
	}

	return validation.ValidateStruct(
		&r,
		validation.Field(&r.OldPassword, validation.Required, validation.Length(6, 72)),
		validation.Field(&r.NewPassword, validation.Required, validation.Length(6, 72)),
	)
}
