package gfrModel

import (
	"renal_tracker/internal/enum/creatinineCurrency"
	"renal_tracker/internal/enum/gfrCurrency"
	"renal_tracker/internal/enum/sex"
	"renal_tracker/pkg"
	"renal_tracker/pkg/gfr/getResultsPkg"
	"time"
)

type GfrResult struct {
	ID                 string                                 `db:"id"`
	UserID             string                                 `db:"user_id"`
	Creatinine         *float32                               `db:"creatinine"`
	CreatinineCurrency *creatinineCurrency.CreatinineCurrency `db:"creatinine_currency"`
	Weight             *float32                               `db:"weight"`
	Height             *float32                               `db:"height"`
	Sex                *sex.Sex                               `db:"sex"`
	BSA                float32                                `db:"bsa"`
	Age                *uint8                                 `db:"age"`
	GFR                uint8                                  `db:"gfr"`
	GFRCurrency        gfrCurrency.GFRCurrency                `db:"gfr_currency"`
	GFRMediumStart     *uint8                                 `db:"gfr_medium_start"`
	GFRMediumEnd       *uint8                                 `db:"gfr_medium_end"`
	GFRMinimum         *uint8                                 `db:"gfr_minimum"`
	IsAbsolute         *bool                                  `db:"is_absolute"`
	CreatedAt          time.Time                              `db:"created_at"`
	CreatinineTestDate time.Time                              `db:"creatinine_test_date"`
}

func (g *GfrResult) ConvertToResultPkg() getResultsPkg.Result {
	var age uint8
	var creatinineCurrencyPkg *pkg.CreatinineCurrency
	var gfrMediumStart uint8
	var gfrMediumEnd uint8
	var gfrMinimum uint8
	var sex pkg.Sex

	if g.Age != nil {
		age = *g.Age
	}

	if g.CreatinineCurrency != nil {
		creatinineCurrency := g.CreatinineCurrency.ConvertToPkg()

		creatinineCurrencyPkg = &creatinineCurrency
	}

	if g.GFRMediumStart != nil {
		gfrMediumStart = *g.GFRMediumStart
	}

	if g.GFRMediumEnd != nil {
		gfrMediumEnd = *g.GFRMediumEnd
	}

	if g.GFRMinimum != nil {
		gfrMinimum = *g.GFRMinimum
	}

	if g.Sex != nil {
		sexModel := *g.Sex
		sex = sexModel.ConvertToPkg()
	}

	return getResultsPkg.Result{
		ID:                 g.ID,
		Creatinine:         g.Creatinine,
		CreatinineCurrency: creatinineCurrencyPkg,
		Weight:             g.Weight,
		Height:             g.Height,
		Sex:                sex,
		BSA:                &g.BSA,
		Age:                age,
		GFR:                g.GFR,
		GFRCurrency:        g.GFRCurrency.ConvertToPkg(),
		GFRMediumStart:     gfrMediumStart,
		GFRMediumEnd:       gfrMediumEnd,
		GFRMinimum:         gfrMinimum,
		IsAbsolute:         g.IsAbsolute,
		CreatedAt:          g.CreatedAt,
		CreatinineTestDate: g.CreatinineTestDate,
	}
}
