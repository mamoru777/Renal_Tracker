package getResultsUsecase

import (
	"database/sql"
	"errors"
	"renal_tracker/pkg/gfr/getResultsPkg"
	"renal_tracker/tools/pointer"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type UseCase struct {
	getGfrResults getGfrResults
}

func New(getGfrResults getGfrResults) *UseCase {
	return &UseCase{getGfrResults: getGfrResults}
}

func (u *UseCase) Execute(c *fiber.Ctx) error {
	log := log.With().Str("layer", "getResultsUsecase").Logger()

	accessToken := c.Locals("accessToken").(string)
	refreshToken := c.Locals("refreshToken").(string)

	c.Set("accessToken", accessToken)
	c.Set("refreshToken", refreshToken)

	userID := c.Locals("userID").(string)

	req := getResultsPkg.GetResultsV0Request{}

	queries := c.Queries()

	idsStr := queries["ids"]

	if idsStr != "" {
		req.IDs = strings.Split(idsStr, ",")
	}

	limitStr := queries["limit"]

	if limitStr != "" {
		limit, err := strconv.ParseUint(limitStr, 10, 8)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		req.Limit = pointer.Pointer(uint8(limit))
	}

	offsetStr := queries["offset"]

	if offsetStr != "" {
		offset, err := strconv.ParseUint(offsetStr, 10, 8)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		req.Offset = pointer.Pointer(uint8(offset))
	}

	results, err := u.getGfrResults.GetGfrResults(c.Context(), userID, req)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return c.SendStatus(fiber.StatusOK)
		} else {
			log.Error().Err(err).Msg("can not get gfr results")

			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	}

	resp := getResultsPkg.GetResultsV0Response{
		Results: make([]getResultsPkg.Result, 0, len(results)),
	}

	for _, res := range results {
		resp.Results = append(resp.Results, res.ConvertToResultPkg())
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
