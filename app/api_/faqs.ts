import axios from "@/app/lib/axios";

export async function listFaqs(
    limit: number,
    offset: number,
    type?: string,
    search?: string
) {
    const response = await axios.get(`/faqs`, {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function create(formData: FormData) {
    const response = await axios.post(`/faqs`, formData);
    return response.data;
}
export async function updateFaq(id: string, formData: FormData) {
    const response = await axios.put(`/faqs/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function updateStatus(id: string, status: string) {
    const response = await axios.put(`/faqs/${id}`, { status });
    return response.data;
}

export async function deleteFaq(id: string) {
    const response = await axios.delete(`/faqs/${id}`);
    return response.data;
}
