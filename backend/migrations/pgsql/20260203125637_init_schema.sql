-- +goose Up
-- +goose StatementBegin
CREATE SCHEMA IF NOT EXISTS renal;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP SCHEMA IF EXISTS renal CASCADE;
-- +goose StatementEnd
