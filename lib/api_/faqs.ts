import axios from "@/lib/axios";

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

type FaqPayload = {
    question: string;
    answer: string;
    type: string;
};

export async function createFaq(payload: FaqPayload) {
    const response = await axios.post("/faqs", payload);
    return response.data;
}

export async function updateFaq(id: string, payload: FaqPayload) {
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
