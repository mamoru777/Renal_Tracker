-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'creatinine_currency') THEN
        CREATE TYPE renal."creatinine_currency" AS ENUM ('mg/dl', 'mkmol/l');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gfr_currency') THEN
        CREATE TYPE renal."gfr_currency" AS ENUM ('ml/min/m2');
    END IF;
END
$$;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE renal."creatinine_currency";
DROP TYPE renal."gfr_currency";
-- +goose StatementEnd