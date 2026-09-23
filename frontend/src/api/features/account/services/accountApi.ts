import axiosClient from "../../../axiosClient";
import type { Account, CreateAccountRequest } from "../types/account.types";

export const accountService = {
  getAllAccounts: async (): Promise<Account[]> => {
    const response = await axiosClient.get<Account[]>("/accounts");
    return response.data;
  },

  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await axiosClient.post<Account>("/accounts", data);
    return response.data;
  },
};
