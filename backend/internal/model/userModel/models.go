package userModel

import (
	"renal_tracker/internal/enum/sex"
	"time"
)

type User struct {
	ID           string     `db:"id"`
	Name         string     `db:"name"`
	Surname      string     `db:"surname"`
	Patronymic   *string    `db:"patronymic"`
	Email        string     `db:"email"`
	PasswordHash []byte     `db:"password_hash"`
	PasswordSalt []byte     `db:"password_salt"`
	Birth        time.Time  `db:"birth"`
	Sex          sex.Sex    `db:"sex"`
	Weight       *float32   `db:"weight"`
	Height       *float32   `db:"height"`
	LastLoginAt  *time.Time `db:"last_login_at"`
}

type CustomClaims struct {
	UserID string `json:"userID"`
}
