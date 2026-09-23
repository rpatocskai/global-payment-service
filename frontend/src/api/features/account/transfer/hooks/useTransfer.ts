import { useState, useEffect } from "react";
import type { Account, Currency } from "../../types/account.types";
import { accountService } from "../../services/accountApi";
import { transferService } from "../services/trasferApi";

export const useTransfer = (onSuccessCallback?: () => void) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);

  const [sourceAccountId, setSourceAccountId] = useState<string>("");
  const [targetAccountId, setTargetAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("HUF");

  const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
    crypto.randomUUID(),
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateNewKey = () => {
    setIdempotencyKey(crypto.randomUUID());
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAllAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err || "Nem sikerült a számlák betöltése az utaláshoz.");
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleTransfer = async () => {
    setError(null);
    setSuccess(null);

    const sourceId = parseInt(sourceAccountId, 10);
    const targetId = parseInt(targetAccountId, 10);
    const numericAmount = parseFloat(amount);

    if (!sourceId || !targetId) {
      setError("A forrás és a cél számla kiválasztása kötelező.");
      return;
    }
    if (sourceId === targetId) {
      setError("A forrás és a cél számla nem egyezhet meg.");
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Az utalni kívánt összegnek pozitív számnak kell lennie.");
      return;
    }

    try {
      setLoading(true);
      const response = await transferService.createTransfer(idempotencyKey, {
        sourceAccountId: sourceId,
        targetAccountId: targetId,
        amount: numericAmount,
        currency,
      });

      setSuccess(
        `Sikeres utalás! Tranzakció azonosító: #${response.transferId}.`,
      );
      setAmount("");
      generateNewKey();
      if (onSuccessCallback) {
        setTimeout(() => {
          onSuccessCallback();
        }, 1000);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err?.message
          : "Hiba történt az utalás feldolgozása során.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
