package global_payment_service.backend.transfer;

import global_payment_service.backend.account.Account;
import global_payment_service.backend.account.AccountRepository;
import global_payment_service.backend.transfer.client.ExchangeRateService;
import global_payment_service.backend.transfer.idempotency.IdempotencyKey;
import global_payment_service.backend.transfer.idempotency.IdempotencyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final TransferRepository transferRepository;
    private final IdempotencyRepository idempotencyRepository;
    private final ExchangeRateService exchangeRateService;
    private final ObjectMapper objectMapper;

    public TransferService(AccountRepository accountRepository, TransferRepository transferRepository,
                           IdempotencyRepository idempotencyRepository, ExchangeRateService exchangeRateService,
                           ObjectMapper objectMapper) {
        this.accountRepository = accountRepository;
        this.transferRepository = transferRepository;
        this.idempotencyRepository = idempotencyRepository;
        this.exchangeRateService = exchangeRateService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public TransferResponse processTransfer(String idempotencyKey, TransferDTO request) {
        if (request.getSourceAccountId().equals(request.getTargetAccountId())) {
            throw new IllegalArgumentException("A forrás és a cél számla nem egyezhet meg.");
        }

        var existingKeyOpt = idempotencyRepository.findById(Long.valueOf(idempotencyKey));
        if (existingKeyOpt.isPresent()) {
            IdempotencyKey key = existingKeyOpt.get();
            if (key.getStatus() == IdempotencyKey.KeyStatus.IN_PROGRESS) {
                throw new IllegalStateException("A kérés feldolgozása még folyamatban van (409 Conflict).");
            } else if (key.getStatus() == IdempotencyKey.KeyStatus.SUCCESS) {
                try {
                    return objectMapper.readValue(key.getResponseBody(), TransferResponse.class);
                } catch (Exception e) {
                    throw new RuntimeException("Hiba a korábbi válasz visszaállítása során.");
                }
            }
        }

        IdempotencyKey currentKey = IdempotencyKey.builder()
                .clientKey(idempotencyKey)
                .status(IdempotencyKey.KeyStatus.IN_PROGRESS)
                .updatedAt(LocalDateTime.now())
                .build();
        idempotencyRepository.saveAndFlush(currentKey);

        try {
            Long firstId = Math.min(request.getSourceAccountId(), request.getTargetAccountId());
            Long secondId = Math.max(request.getSourceAccountId(), request.getTargetAccountId());

            accountRepository.findByIdWithLock(firstId);
            accountRepository.findByIdWithLock(secondId);

            Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                    .orElseThrow(() -> new IllegalArgumentException("A megadott forrás számla nem létezik."));
            Account targetAccount = accountRepository.findById(request.getTargetAccountId())
                    .orElseThrow(() -> new IllegalArgumentException("A megadott cél számla nem létezik."));

            if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
                throw new IllegalArgumentException("Nincs elegendő fedezet a forrás számlán.");
            }

            BigDecimal rate = exchangeRateService.getExchangeRateWithRetry(request.getCurrency(), targetAccount.getCurrency());

            sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));

            BigDecimal targetAmount = request.getAmount().multiply(rate).setScale(4, RoundingMode.HALF_UP);
            targetAccount.setBalance(targetAccount.getBalance().add(targetAmount));

            accountRepository.save(sourceAccount);
            accountRepository.save(targetAccount);

            Transfer transfer = Transfer.builder()
                    .sourceAccount(sourceAccount)
                    .targetAccount(targetAccount)
                    .amount(request.getAmount())
                    .currency(request.getCurrency().name())
                    .exchangeRate(rate)
                    .createdAt(LocalDateTime.now())
                    .build();
            transferRepository.save(transfer);

            TransferResponse response = new TransferResponse(
                    transfer.getId(), "SUCCESS", sourceAccount.getBalance(), targetAccount.getBalance()
            );

            currentKey.setStatus(IdempotencyKey.KeyStatus.SUCCESS);
            currentKey.setResponseBody(objectMapper.writeValueAsString(response));
            idempotencyRepository.save(currentKey);

            return response;

        } catch (Exception e) {
            currentKey.setStatus(IdempotencyKey.KeyStatus.FAILED);
            idempotencyRepository.save(currentKey);
            throw new RuntimeException(e.getMessage());
        }
    }
}
