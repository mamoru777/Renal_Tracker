-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex') THEN
        CREATE TYPE renal."sex" AS ENUM ('male', 'female');
    END IF;
END
$$;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE renal."sex";
-- +goose StatementEnd
