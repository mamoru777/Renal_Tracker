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
	ID                 string                  `json:"id" binding:"required"`
	Creatinine         *float32                `json:"creatinine"`
	CreatinineCurrency *pkg.CreatinineCurrency `json:"creatinineCurrency"`
	Weight             *float32                `json:"weight"`
	Height             *float32                `json:"height"`
	Sex                pkg.Sex                 `json:"sex" binding:"required"`
	BSA                *float32                `json:"bsa"`
	Age                uint8                   `json:"age" binding:"required"`
	GFR                uint8                   `json:"gfr" binding:"required"`
	GFRCurrency        pkg.GFRCurrency         `json:"gfrCurrency" binding:"required"`
	IsAbsolute         *bool                   `json:"isAbsolute"`
	CreatinineTestDate time.Time               `json:"creatinineTestDate" binding:"required"`
	CreatedAt          time.Time               `json:"createdAt" binding:"required"`

	GFRMediumStart uint8 `json:"gfrMediumStart" binding:"required"`
	GFRMediumEnd   uint8 `json:"gfrMediumEnd" binding:"required"`
	GFRMinimum     uint8 `json:"gfrMinimum" binding:"required"`
}

type GetResultsV0Response struct {
	Results []Result `json:"results" binding:"required"`
}
