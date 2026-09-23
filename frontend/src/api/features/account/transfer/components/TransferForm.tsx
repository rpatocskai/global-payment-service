import {
  Card,
  CardContent,
  Box,
  Typography,
  Alert,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { Account, Currency } from "../../types/account.types";

interface TransferFormProps {
  accounts: Account[];
  loadingAccounts: boolean;
  sourceAccountId: string;
  setSourceAccountId: (val: string) => void;
  targetAccountId: string;
  setTargetAccountId: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  currency: Currency;
  setCurrency: (val: Currency) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  idempotencyKey: string;
  onSubmit: () => void;
}

export const TransferForm = ({
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
  onSubmit,
}: TransferFormProps) => {
  const displayAmount = amount === "0" || amount === "" ? "" : amount;

  if (loadingAccounts) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <SendIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Pénzutalás indítása</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Kis infó doboz az interjúztatónak az aktív idempotencia kulcsról (nagy villantás!) */}
        <Box sx={{ bgcolor: "#f0f4f8", p: 1.5, borderRadius: 1, mb: 3 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontFamily: "monospace",
              display: "block",
              wordBreak: "break-all",
            }}
          >
            🔒 Aktív Idempotencia Kulcs:{" "}
            {idempotencyKey || "Generálás folyamatban..."}
          </Typography>
        </Box>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Forrás számla"
                fullWidth
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                sx={{ mb: 2 }}
              >
                {accounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id.toString()}>
                    #{acc.id} ({acc.currency}) - Egyenleg: {acc.balance}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Cél számla"
                fullWidth
                value={targetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                sx={{ mb: 2 }}
              >
                {accounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id.toString()}>
                    #{acc.id} ({acc.currency})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Összeg"
                type="number"
                fullWidth
                value={displayAmount}
                onChange={(e) => setAmount(e.target.value)}
                slotProps={{
                  htmlInput: { min: 0.01, step: "0.01", placeholder: "0.00" },
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                label="Utalás devizája"
                fullWidth
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                sx={{ mb: 3 }}
              >
                <MenuItem value="HUF">HUF</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            {loading ? "Feldolgozás..." : "Utalás indítása"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
