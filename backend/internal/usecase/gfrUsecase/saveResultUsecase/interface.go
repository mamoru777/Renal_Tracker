package saveResultUsecase

import (
	"context"
	"renal_tracker/pkg/gfr/saveResultPkg"
)

type createGfrResult interface {
	CreateGfrResult(ctx context.Context, model saveResultPkg.SaveResultV0Request, userID string) (string, error)
}
