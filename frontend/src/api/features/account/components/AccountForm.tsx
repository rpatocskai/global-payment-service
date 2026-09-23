import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Alert,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import AddCardIcon from "@mui/icons-material/AddCard";
import type { Currency } from "../types/account.types";

interface AccountFormProps {
  balance: string;
  setBalance: (val: string) => void;
  currency: Currency;
  setCurrency: (val: Currency) => void;
  formError: string | null;
  successMessage: string | null;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export const AccountForm = ({
  balance,
  setBalance,
  currency,
  setCurrency,
  formError,
  successMessage,
  onSubmit,
}: AccountFormProps) => {
  const displayValue = balance === "0" || balance === "" ? "" : balance;

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AddCardIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Új számla nyitása</Typography>
        </Box>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <TextField
            label="Kezdő egyenleg"
            type="number"
            fullWidth
            variant="outlined"
            value={displayValue}
            onChange={(e) => {
              const val = e.target.value;
              setBalance(val);
            }}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
                placeholder: "0.00",
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Devizanem"
            fullWidth
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            sx={{ mb: 3 }}
          >
            <MenuItem value="HUF">HUF (Magyar Forint)</MenuItem>
            <MenuItem value="EUR">EUR (Euro)</MenuItem>
            <MenuItem value="USD">USD (Amerikai Dollár)</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Számla létrehozása
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
