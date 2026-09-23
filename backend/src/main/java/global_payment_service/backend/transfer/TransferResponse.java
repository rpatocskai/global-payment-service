package global_payment_service.backend.transfer;

import java.math.BigDecimal;

public record TransferResponse(
        Long transferId,
        String status,
        BigDecimal sourceNewBalance,
        BigDecimal targetNewBalance
) {}