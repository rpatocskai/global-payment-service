package global_payment_service.backend.account;

import global_payment_service.backend.common.model.Currency;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountDTO {

    @NotNull(message = "Entering the opening balance is mandatory.")
    @PositiveOrZero(message = "The opening balance cannot be negative.")
    private BigDecimal balance;

    @NotNull(message = "Specifying the currency is mandatory.")
    private Currency currency;
}