import { Container } from "@mui/material";
import { useTransfer } from "../api/features/account/transfer/hooks/useTransfer";
import { TransferForm } from "../api/features/account/transfer/components/TransferForm";

interface TransferPageProps {
  onTransferSuccess: () => void;
}

export const TransferPage = ({ onTransferSuccess }: TransferPageProps) => {
  const {
    accounts,
    loadingAccounts,
    sourceAccountId,
    setSourceAccountId,
    targetAccountId,
    setTargetAccountId,
    amount,
    setAmount,
    currency,
    setCurrency,
    loading,
    error,
    success,
    idempotencyKey,
    handleTransfer,
  } = useTransfer(onTransferSuccess);

  return (
    <Container maxWidth="md">
      <TransferForm
        accounts={accounts}
        loadingAccounts={loadingAccounts}
        sourceAccountId={sourceAccountId}
        setSourceAccountId={setSourceAccountId}
        targetAccountId={targetAccountId}
        setTargetAccountId={setTargetAccountId}
        amount={amount}
        setAmount={setAmount}
        currency={currency}
        setCurrency={setCurrency}
        loading={loading}
        error={error}
        success={success}
        idempotencyKey={idempotencyKey}
        onSubmit={handleTransfer}
      />
    </Container>
  );
};
