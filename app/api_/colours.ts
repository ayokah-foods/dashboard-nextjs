import { ColorType } from "@/types/ColorType";
import axios from "../lib/axios";

export async function listColours(limit?: number, offset?: number) {
    const response = await axios.get(`/colors?limit=${limit}&offset=${offset}`);
    return response.data;
}

export async function addColours(data: { name: string; hexcode: string }) {
    const response = await axios.post(`/colors`, data);
    return response.data;
}


export async function editColour(id: number, formData: ColorType) {
    const response = await axios.put(`/colors/${id}`, formData);
    return response.data;
}
export async function deleteColour(id: number) {
    const response = await axios.delete(`/colors/${id}`);
    return response.data;
}
