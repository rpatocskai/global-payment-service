package global_payment_service.backend.transfer.client;


import global_payment_service.backend.common.model.Currency;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class ExchangeRateService {

    private final Random random = new Random();

    public BigDecimal getExchangeRateWithRetry(Currency from, Currency to) {
        int maxAttempts = 3;
        int attempt = 0;

        while (attempt < maxAttempts) {
            try {
                attempt++;
                return fetchRateFromFlakyExternalApi(from, to);
            } catch (RuntimeException e) {
                if (attempt >= maxAttempts) {
                    throw new RuntimeException("A külső árfolyam-szolgáltatás tartósan nem elérhető (503). Kérjük próbálja meg később.");
                }

                try {
                    Thread.sleep(200);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        throw new RuntimeException("Ismeretlen hiba az árfolyam lekérdezése során.");
    }

    private BigDecimal fetchRateFromFlakyExternalApi(Currency from, Currency to) {
        if (from == to) return BigDecimal.ONE;


        try {
            Thread.sleep(random.nextInt(200) + 100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        if (random.nextDouble() < 0.3) {
            throw new RuntimeException("HTTP 503 Service Unavailable");
        }

        if (from == Currency.EUR && to == Currency.HUF) return new BigDecimal("400.0");
        if (from == Currency.HUF && to == Currency.EUR) return new BigDecimal("0.0025");
        if (from == Currency.USD && to == Currency.HUF) return new BigDecimal("360.0");
        if (from == Currency.HUF && to == Currency.USD) return new BigDecimal("0.002778");
        if (from == Currency.EUR && to == Currency.USD) return new BigDecimal("1.1");
        if (from == Currency.USD && to == Currency.EUR) return new BigDecimal("0.91");

        return BigDecimal.ONE;
    }
}