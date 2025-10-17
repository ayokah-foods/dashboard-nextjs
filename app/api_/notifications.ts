import axios from "../lib/axios";
import { NotificationResponse } from "@/types/NotificationsType";

export async function getNotifications(params: {
  limit: number;
  offset: number;
  receiver?: string; 
}): Promise<NotificationResponse> {
  const response = await axios.get<NotificationResponse>('/notifications', {
    params,
  });
  return response.data;
}

export async function sendNotification(formData: FormData) {
  const response = await axios.post("/notification/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}
export async function deleteNotification(id: number) {
  const response = await axios.delete(`/notifications/${id}`);
  return response.data;
}