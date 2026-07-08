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

export async function create(payload: {
    question: string;
    answer: string;
    type: string;
    status: string;
}) {
    const response = await axios.post(`/faqs`, payload);
    return response.data;
}

export async function updateFaq(
    id: string,
    payload: {
        question?: string;
        answer?: string;
        type?: string;
        status?: string;
    }
) {
    const response = await axios.put(`/faqs/${id}`, payload);
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
