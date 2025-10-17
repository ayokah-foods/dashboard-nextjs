import axios from "../lib/axios";

export async function listReviews(limit?: number, offset?: number) {
    const response = await axios.get(`/reviews?limit=${limit}&offset=${offset}`);
    return response.data;
}
export async function listUnReviews(limit?: number, offset?: number) {
    const response = await axios.get(`/unreviews?limit=${limit}&offset=${offset}`);
    return response.data;
}

export async function reviewStats() {
    const response = await axios.get(`/review-stats`);
    return response.data;
}