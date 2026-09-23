CREATE TABLE accounts
(
    id       BIGSERIAL PRIMARY KEY,
    balance  NUMERIC(19, 4) NOT NULL,
    currency VARCHAR(3)     NOT NULL,
    version  BIGINT         NOT NULL DEFAULT 0
);

-- Opcionális: Tesztadatok beszúrása a könnyebb induláshoz
INSERT INTO accounts (balance, currency, version)
VALUES (1000.0000, 'HUF', 0);
INSERT INTO accounts (balance, currency, version)
VALUES (2500.5000, 'EUR', 0);
INSERT INTO accounts (balance, currency, version)
VALUES (500.0000, 'USD', 0);
