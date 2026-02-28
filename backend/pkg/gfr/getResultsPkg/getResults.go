package getResultsPkg

import (
	"renal_tracker/pkg"
	"time"
)

const GetResultsV0MethodPath = "/api/gfr/getResults"

type GetResultsV0Request struct {
	IDs    []string
	Limit  *uint8
	Offset *uint8
}

type Result struct {
	ID                 string                  `json:"id"`
	Creatinine         *float32                `json:"creatinine"`
	CreatinineCurrency *pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32                `json:"weight"`
	Height             *float32                `json:"height"`
	Sex                pkg.Sex                 `json:"sex"`
	BSA                *float32                `json:"bsa"`
	Age                uint8                   `json:"age"`
	GFR                uint8                   `json:"gfr"`
	GFRCurrency        pkg.GFRCurrency         `json:"gfrCurrency"`
	IsAbsolute         *bool                   `json:"isAbsolute"`
	CreatinineTestDate time.Time               `json:"creatinineTestDate"`
	CreatedAt          time.Time               `json:"createdAt"`

	GFRMediumStart uint8 `json:"gfrMediumStart"`
	GFRMediumEnd   uint8 `json:"gfrMediumEnd"`
	GFRMinimum     uint8 `json:"gfrMinimum"`
}

type GetResultsV0Response struct {
	Results []Result `json:"results"`
}
