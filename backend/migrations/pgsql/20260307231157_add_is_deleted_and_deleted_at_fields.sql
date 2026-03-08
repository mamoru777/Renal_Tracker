-- +goose Up
-- +goose StatementBegin
ALTER TABLE renal.gfr_results ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE renal.gfr_results ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE renal.gfr_results DROP COLUMN IF EXISTS is_deleted;

ALTER TABLE renal.gfr_results DROP COLUMN IF EXISTS deleted_at;
-- +goose StatementEnd