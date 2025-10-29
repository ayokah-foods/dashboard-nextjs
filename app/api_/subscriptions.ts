import { SubscriptionType } from "@/types/SubscriptionType";
import axios from "../lib/axios";

export async function listSubscriptions() {
    const response = await axios.get("/subscriptions");
    return response.data;
}

export async function createSubscription(data: SubscriptionType) {
    const response = await axios.post("/subscriptions", data);
    return response.data;
}

export async function deleteSubscription(id: number) {
    const response = await axios.delete(`/subscriptions/${id}`);
    return response.data;
}