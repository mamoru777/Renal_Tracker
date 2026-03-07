package deletePkg

import validation "github.com/go-ozzo/ozzo-validation/v4"

const DeleteV0MethodPath = "/api/gfr/delete"

type DeleteV0Request struct {
	GfrID string `json:"gfrID"`
}

type DeleteV0Response struct{}

func (d DeleteV0Request) Validate() error {
	return validation.ValidateStruct(
		&d,
		validation.Field(&d.GfrID, validation.Required),
	)
}
