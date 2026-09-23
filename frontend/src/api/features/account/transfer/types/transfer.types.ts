import type { Currency } from "../../types/account.types";

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: number;
  currency: Currency;
}

export interface TransferResponse {
  transferId: number;
  status: string;
  sourceNewBalance: number;
  targetNewBalance: number;
}
