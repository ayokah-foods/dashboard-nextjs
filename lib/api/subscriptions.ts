import { SubscriptionType } from "@/types/SubscriptionType";
import axios from "../../app/lib/axios";

export async function listSubscriptions() {
    const response = await axios.get("/subscriptions");
    return response.data;
}

export async function createSubscription(data: SubscriptionType) {
    const response = await axios.post("/subscriptions", data);
    return response.data;
}

export async function updateSubscription(id: number, data: SubscriptionType) {
    const response = await axios.put(`/subscriptions/${id}`, data);
    return response.data;
}

export async function deleteSubscription(id: number) {
    const response = await axios.delete(`/subscriptions/${id}`);
    return response.data;
}

export async function listSubscribers() {
    const response = await axios.get("/subscribers");
    return response.data;
}
