import { TransactionResponse } from "@/types/TransactionType";
import axios from "../lib/axios";

export async function getTransactions(params: {
  limit: number;
  offset: number;
  type?: string;
  search?: string;
  status?: string;
}): Promise<TransactionResponse> {
  const response = await axios.get<TransactionResponse>('/transactions', {
    params,
  });
  return response.data;
}