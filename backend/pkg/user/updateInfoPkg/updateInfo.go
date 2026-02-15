package updateInfoPkg

import (
	"renal_tracker/pkg"
	"time"
)

const UpdateUserInfoV0MethodPath = "/user/updateInfo"

type UpdateUserInfoV0Request struct {
	Name       *string    `json:"name"`
	Surname    *string    `json:"surname"`
	Patronymic *string    `json:"patronymic"`
	DateBirth  *time.Time `json:"dateBirth"`
	Sex        *pkg.Sex   `json:"sex"`
	Weight     *float32   `json:"weight"`
	Height     *float32   `json:"height"`
}

type UpdateUserInfoV0Response struct {
	Email      string    `json:"email"`
	Name       string    `json:"name"`
	Surname    string    `json:"surname"`
	Patronymic *string   `json:"patronymic"`
	DateBirth  time.Time `json:"dateBirth"`
	Sex        pkg.Sex   `json:"sex"`
	Weight     *float32  `json:"weight"`
	Height     *float32  `json:"height"`
}

func (r UpdateUserInfoV0Request) Validate() error {
	return r.Sex.Validate()
}
