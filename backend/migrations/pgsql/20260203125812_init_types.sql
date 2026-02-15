-- +goose Up
-- +goose StatementBegin
CREATE TYPE rental."sex" AS ENUM ('male', 'female');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE rental."sex";
-- +goose StatementEnd