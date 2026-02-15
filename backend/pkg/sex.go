package pkg

import "errors"

var (
	ErrUnknownSex = errors.New("unknown sex")
)

type Sex string

const (
	Male   Sex = "male"
	Female Sex = "female"
)

func (s Sex) Validate() error {
	if s == Male || s == Female {
		return nil
	}

	return ErrUnknownSex
}
