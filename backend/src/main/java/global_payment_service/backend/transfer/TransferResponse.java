package global_payment_service.backend.transfer;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record TransferResponse(
        @JsonProperty("transferId") Long transferId,
        @JsonProperty("status") String status,
        @JsonProperty("sourceNewBalance") BigDecimal sourceNewBalance,
        @JsonProperty("targetNewBalance") BigDecimal targetNewBalance
) {}
