package global_payment_service.backend.account;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    @Transactional
    public AccountResponse createAccount(AccountDTO request) {
        Account account = Account.builder()
                .balance(request.getBalance())
                .currency(request.getCurrency())
                .build();

        Account savedAccount = accountRepository.save(account);
        return AccountResponse.fromEntity(savedAccount);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(AccountResponse::fromEntity)
                .collect(Collectors.toList());
    }
}

