package passwordManager

import (
	"bytes"
	"crypto/rand"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

const (
	saltSize          = 16
	maxPasswordLength = 72
)

func CreateNewPassword(password, generalSalt, userSalt []byte) ([]byte, error) {

	if len(password) > maxPasswordLength {
		availableLength := len(password) - len(generalSalt) - saltSize
		return nil, fmt.Errorf("Длина пароля не должна превышать %v символов", availableLength)
	}

	passwordHash, err := bcrypt.GenerateFromPassword(SaltPassword(password, userSalt, generalSalt), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return passwordHash, nil
}

func CompareHashAndPassword(hash, password, userSalt, generalSalt []byte) error {

	if len(password) > maxPasswordLength {
		availableLength := len(password) - len(generalSalt) - saltSize
		return fmt.Errorf("Длина пароля не должна превышать %v символов", availableLength)
	}

	if err := bcrypt.CompareHashAndPassword(hash, SaltPassword(password, userSalt, generalSalt)); err != nil {
		return err
	}
	return nil
}

func SaltPassword(password, userSalt, generalSalt []byte) []byte {
	return bytes.Join([][]byte{userSalt, password, generalSalt}, nil)
}

func GenerateRandomSalt() ([]byte, error) {
	b := make([]byte, saltSize)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}

	return b, nil
}
