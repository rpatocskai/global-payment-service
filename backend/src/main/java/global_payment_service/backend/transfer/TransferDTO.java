package global_payment_service.backend.transfer;

import global_payment_service.backend.common.model.Currency;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferDTO {
    @NotNull(message = "A forrás számla azonosítója kötelező.")
    private Long sourceAccountId;

    @NotNull(message = "A cél számla azonosítója kötelező.")
    private Long targetAccountId;

    @NotNull(message = "Az összeg megadása kötelező.")
    @Positive(message = "Az utalni kívánt összegnek pozitívnak kell lennie.")
    private BigDecimal amount;

    @NotNull(message = "A devizanem megadása kötelező.")
    private Currency currency;
}