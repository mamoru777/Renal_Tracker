package getResultsUsecase

import (
	"context"
	"renal_tracker/internal/model/gfrModel"
	"renal_tracker/pkg/gfr/getResultsPkg"
)

type getGfrResults interface {
	GetGfrResults(ctx context.Context, userID string, req getResultsPkg.GetResultsV0Request) ([]gfrModel.GfrResult, error)
}
