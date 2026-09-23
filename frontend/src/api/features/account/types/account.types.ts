export type Currency = "HUF" | "EUR" | "USD";

export interface Account {
  id: number;
  balance: number;
  currency: Currency;
}

export interface CreateAccountRequest {
  balance: number;
  currency: Currency;
}
