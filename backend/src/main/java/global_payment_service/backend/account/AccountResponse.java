package global_payment_service.backend.account;

import global_payment_service.backend.common.model.Currency;

import java.math.BigDecimal;

public record AccountResponse(
        Long id,
        BigDecimal balance,
        Currency currency
) {
    public static AccountResponse fromEntity(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getBalance(),
                account.getCurrency()
        );
    }
}