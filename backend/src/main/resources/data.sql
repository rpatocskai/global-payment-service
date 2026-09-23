INSERT INTO accounts (balance, currency, version)
VALUES (1000.0000, 'HUF', 0)
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (balance, currency, version)
VALUES (2500.5000, 'EUR', 0)
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (balance, currency, version)
VALUES (500.0000, 'USD', 0)
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (balance, currency, version)
SELECT 1000.0000, 'HUF', 0
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE id = 1);

INSERT INTO accounts (balance, currency, version)
SELECT 2500.5000, 'EUR', 0
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE id = 2);

INSERT INTO accounts (balance, currency, version)
SELECT 500.0000, 'USD', 0
    WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE id = 3);
