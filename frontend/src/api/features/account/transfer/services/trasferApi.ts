import axiosClient from "../../../../axiosClient";
import type {
  TransferRequest,
  TransferResponse,
} from "../types/transfer.types";

export const transferService = {
  createTransfer: async (
    idempotencyKey: string,
    data: TransferRequest,
  ): Promise<TransferResponse> => {
    const response = await axiosClient.post<TransferResponse>(
      "/transfers",
      data,
      {
        headers: {
          "X-Idempotency-Key": idempotencyKey,
        },
      },
    );
    return response.data;
  },
};
