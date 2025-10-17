import { SizeType } from "@/types/SizeType";
import axios from "../lib/axios";


export async function listSizes(limit?: number, offset?: number) {
    const response = await axios.get<SizeType>(`/sizes?limit=${limit}&offset=${offset}`);
    return response.data;
}

export async function addSizes(data: { name: string }) {
    const response = await axios.post(`/sizes`, data);
    return response.data;
}

export async function deleteSizes(id: number) {
    const response = await axios.delete(`/sizes/${id}`);
    return response.data;
}