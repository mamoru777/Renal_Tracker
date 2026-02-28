package pkg

import "errors"

var ErrUnkownGFRCurrency = errors.New("uknown gfr currency")

type GFRCurrency string

const ML_MIN_M2 = "ml/min/m2"

func (g GFRCurrency) Validate() error {
	if g == ML_MIN_M2 {
		return nil
	}

	return ErrUnkownGFRCurrency
}
