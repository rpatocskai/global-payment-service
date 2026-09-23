INSERT INTO accounts (balance, currency, version)
VALUES (1000.0000, 'HUF', 0)
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (balance, currency, version)
VALUES (2500.5000, 'EUR', 0)
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (balance, currency, version)
VALUES (500.0000, 'USD', 0)
    ON CONFLICT DO NOTHING;