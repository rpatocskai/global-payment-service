import { Grid } from "@mui/material";
import { AccountForm } from "../api/features/account/components/AccountForm";
import { AccountTable } from "../api/features/account/components/AccountTable";
import { useAccounts } from "../api/features/account/hooks/useAccounts";

export const AccountsPage = () => {
  const {
    accounts,
    loading,
    error,
    balance,
    setBalance,
    currency,
    setCurrency,
    formError,
    successMessage,
    createAccount,
  } = useAccounts();

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 4 }}>
        <AccountForm
          balance={balance}
          setBalance={setBalance}
          currency={currency}
          setCurrency={setCurrency}
          formError={formError}
          successMessage={successMessage}
          onSubmit={createAccount}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <AccountTable accounts={accounts} loading={loading} error={error} />
      </Grid>
    </Grid>
  );
};
