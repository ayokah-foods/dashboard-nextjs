import { CommissionFormType } from "@/types/CommissionFormType";
import axios from "../lib/axios";
 
export async function getCommissions() {
  const response = await axios.get(`/commissions`);
  return response.data;
}

export async function createCommission(payload: CommissionFormType) {
  const response = await axios.post(`/commissions`, payload);
  return response.data;
}

export async function updateCommission(id: number, payload: CommissionFormType) {
  const response = await axios.put(`/commissions/${id}`, payload);
  return response.data;
}

export async function deleteCommission(id: number) {
  const response = await axios.delete(`/commissions/${id}`);
  return response.data;
}