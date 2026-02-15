-- +goose Up
-- +goose StatementBegin
CREATE SCHEMA IF NOT EXISTS rental;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP SCHEMA IF EXISTS rental CASCADE;
-- +goose StatementEnd