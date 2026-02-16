-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS rental.user (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    patronymic VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    password_hash BYTEA NOT NULL,
    password_salt BYTEA NOT NULL,
    birth TIMESTAMP NOT NULL,
    sex rental."sex" NOT NULL,
    weight decimal,
    height decimal,
    last_login_at TIMESTAMPTZ,
    CONSTRAINT users_pk PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS rental.user;
-- +goose StatementEnd