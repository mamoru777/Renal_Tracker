package gfrCurrency

import (
	"errors"
	"renal_tracker/pkg"
)

var ErrUnkownGFRCurrency = errors.New("uknown gfr currency")

type GFRCurrency string

const ML_MIN_M2 = "ml/min/m2"

func (g GFRCurrency) Validate() error {
	if g == ML_MIN_M2 {
		return nil
	}

	return ErrUnkownGFRCurrency
}

func (g GFRCurrency) ConvertToPkg() pkg.GFRCurrency {
	return pkg.GFRCurrency(g)
}
