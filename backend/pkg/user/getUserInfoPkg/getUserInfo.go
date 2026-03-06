package getUserInfoPkg

import (
	"renal_tracker/pkg"
	"time"
)

const GetUserInfoV0MethodPath = "/api/user/me"

type GetUserInfoV0Request struct{}

type GetUserInfoV0Response struct {
	ID         string    `json:"id" binding:"required"`
	Email      string    `json:"email" binding:"required"`
	Name       string    `json:"name" binding:"required"`
	Surname    string    `json:"surname" binding:"required"`
	Patronymic *string   `json:"patronymic"`
	DateBirth  time.Time `json:"dateBirth" binding:"required"`
	Sex        pkg.Sex   `json:"sex" binding:"required"`
	Weight     *float32  `json:"weight"`
	Height     *float32  `json:"height"`
}
