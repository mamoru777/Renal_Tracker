package userModel

import (
	"renal_tracker/internal/enum/sex"
	"time"
)

type User struct {
	ID           string     `json:"id" db:"id"`
	Name         string     `json:"name" db:"name"`
	Surname      string     `json:"surname" db:"surname"`
	Patronymic   *string    `json:"patronymic,omitempty" db:"patronymic"`
	Email        string     `json:"email" db:"email"`
	PasswordHash []byte     `json:"passwordHash" db:"password_hash"`
	PasswordSalt []byte     `json:"passwordSalt" db:"password_salt"`
	Birth        time.Time  `json:"birth" db:"birth"`
	Sex          sex.Sex    `json:"sex" db:"sex"`
	Weight       *float32   `json:"weight,omitempty" db:"weight"`
	Height       *float32   `json:"height,omitempty" db:"height"`
	LastLoginAt  *time.Time `json:"lastLoginAt,omitempty" db:"last_login_at"`
}

type CustomClaims struct {
	UserID string `json:"userID"`
}
