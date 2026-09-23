import { useState, useEffect, useCallback } from "react";
import type { Account, Currency } from "../types/account.types";
import { accountService } from "../services/accountApi";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [balance, setBalance] = useState<string>("0");
  const [currency, setCurrency] = useState<Currency>("HUF");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await accountService.getAllAccounts();
      setAccounts(data);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Nem sikerült betölteni a számlákat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    accountService
      .getAllAccounts()
      .then((data) => {
        if (isMounted) {
          setAccounts(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Nem sikerült betölteni a számlákat.",
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshAccountsAfterCreation = async () => {
    setLoading(true);
    await fetchAccounts();
  };

  const createAccount = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const numericBalance = parseFloat(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      setFormError(
        "Az egyenleg nem lehet negatív és érvényes számnak kell lennie.",
      );
      return;
    }

    try {
      await accountService.createAccount({ balance: numericBalance, currency });
      setSuccessMessage("Számla sikeresen létrehozva!");
      setBalance("0");
      await refreshAccountsAfterCreation();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err?.message
          : "Hiba történt a számla létrehozása során.",
      );
    }
  };

  return {
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
    refreshAccounts: fetchAccounts,
  };
};
