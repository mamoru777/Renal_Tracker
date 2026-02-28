-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS renal.gfr_results(
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    creatinine decimal,
    creatinine_currency renal."creatinine_currency",
    weight decimal,
    height decimal,
    sex renal."sex",
    bsa decimal,
    age integer,
    gfr integer NOT NULL,
    gfr_currency renal."gfr_currency" DEFAULT 'ml/min/m2',
    gfr_medium_start integer,
    gfr_medium_end integer,
    gfr_minimum integer,
    is_absolute BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    creatinine_test_date DATE NOT NULL,
    CONSTRAINT gfr_results_pk PRIMARY KEY (id),
    CONSTRAINT gfr_results_user_id_fk FOREIGN KEY (user_id) REFERENCES renal.user(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- +goose StatementEnd