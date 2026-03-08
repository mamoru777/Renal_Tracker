package deleteUsecase

import (
	"fmt"
	"renal_tracker/pkg/gfr/deletePkg"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type UseCase struct {
	delete delete
}

func New(delete delete) *UseCase {
	return &UseCase{delete: delete}
}

//		@Summary	Удаление результата расчета
//		@Tags		gfr
//	 	@Accept 	json
//		@Produce	json
//		@Param 		Authorization 	header 		string 		true 		"JWT access token" default "Bearer <token>"
//		@Param 		Cookie 			header 		string 		true 		"Refresh token cookie" 		default 	"refreshToken=<token>"
//		@Param		params	body		deletePkg.DeleteV0Request	true	"request"
//		@Success	200		{object}	deletePkg.DeleteV0Response
//		@Failure	400		{object}	usecase.ErrorResponse
//		@Failure	500		{object}	usecase.ErrorResponse
//		@Router		/api/gfr/delete [post]
func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "deleteUsecase").Logger()

	userID := c.Locals("userID").(string)

	req := deletePkg.DeleteV0Request{}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := req.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := u.delete.Delete(c.Context(), req.GfrIDs, userID); err != nil {
		log.Error().Err(err).Msg(fmt.Sprintf("can not delete gfr result, gfr ids are %v", req.GfrIDs))

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusOK)
}
