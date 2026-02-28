package creatinineCurrency

import (
	"errors"
	"renal_tracker/pkg"
)

type CreatinineCurrency string

var ErrUnknownCreatinineCurrency = errors.New("unknown creatinine currency")

const (
	MG_DL   CreatinineCurrency = "mg/dl"
	MKMOL_L CreatinineCurrency = "mkmol/l"
)

func (c CreatinineCurrency) Validate() error {
	if c == MG_DL || c == MKMOL_L {
		return nil
	}

	return ErrUnknownCreatinineCurrency
}

func (c CreatinineCurrency) ConvertToPkg() pkg.CreatinineCurrency {
	return pkg.CreatinineCurrency(c)
}
