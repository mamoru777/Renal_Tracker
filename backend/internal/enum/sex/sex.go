package sex

import (
	"errors"
	"renal_tracker/pkg"
)

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

func (s Sex) ConvertToPkg() pkg.Sex {
	return pkg.Sex(s)
}
