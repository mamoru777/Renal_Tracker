package updateInfoPkg

import (
	"renal_tracker/pkg"
	"time"
)

const UpdateUserInfoV0MethodPath = "/api/user/updateInfo"

type UpdateUserInfoV0Request struct {
	Name       *string    `json:"name,omitempty"`
	Surname    *string    `json:"surname,omitempty"`
	Patronymic *string    `json:"patronymic,omitempty"`
	DateBirth  *time.Time `json:"dateBirth,omitempty"`
	Sex        *pkg.Sex   `json:"sex,omitempty"`
	Weight     *float32   `json:"weight,omitempty"`
	Height     *float32   `json:"height,omitempty"`
}

type UpdateUserInfoV0Response struct {
	Email      string    `json:"email" binding:"required"`
	Name       string    `json:"name" binding:"required"`
	Surname    string    `json:"surname" binding:"required"`
	Patronymic *string   `json:"patronymic"`
	DateBirth  time.Time `json:"dateBirth" binding:"required"`
	Sex        pkg.Sex   `json:"sex" binding:"required"`
	Weight     *float32  `json:"weight"`
	Height     *float32  `json:"height"`
}

func (r UpdateUserInfoV0Request) Validate() error {
	return r.Sex.Validate()
}
