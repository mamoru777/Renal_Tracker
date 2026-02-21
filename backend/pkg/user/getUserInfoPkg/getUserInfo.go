package getUserInfoPkg

import (
	"renal_tracker/pkg"
	"time"
)

const GetUserInfoV0MethodPath = "/api/user/me"

type GetUserInfoV0Request struct{}

type GetUserInfoV0Response struct {
	ID         string    `json:"id"`
	Email      string    `json:"email"`
	Name       string    `json:"name"`
	Surname    string    `json:"surname"`
	Patronymic *string   `json:"patronymic"`
	DateBirth  time.Time `json:"dateBirth"`
	Sex        pkg.Sex   `json:"sex"`
	Weight     *float32  `json:"weight"`
	Height     *float32  `json:"height"`
}
