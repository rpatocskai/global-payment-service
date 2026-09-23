package global_payment_service.backend.transfer.idempotency;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "idempotency_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyKey {

    public enum KeyStatus { IN_PROGRESS, SUCCESS, FAILED }

    @Id
    @Column(name = "client_key")
    private String clientKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KeyStatus status;

    @Column(name = "response_body", columnDefinition = "TEXT")
    private String responseBody;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}