import { ChatDetailResponse } from "@/types/Ticket";
import axios from "../../app/lib/axios";

export async function getTickets(
    status: string,
    search: string = "",
    priority: string = "",
    limit: number,
    offset: number,
): Promise<ChatDetailResponse> {
    const response = await axios.get<ChatDetailResponse>(`/tickets`, {
        params: { status, search, priority, limit, offset },
    });
    return response.data;
}

export async function getTicketDetail(ticketId: string) {
    const response = await axios.get(`/ticket/${ticketId}/show`);
    return response.data.data;
}
export async function replyTicket(formData: FormData) {
    const response = await axios.post(`/ticket/reply`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });

    return response.data;
}

export async function updateTicketStatus(ticketId: string, status: string) {
    const response = await axios.put(`/ticket/${ticketId}/update`, {
        response_status: status,
    });
    return response;
}

export async function deleteTicket(ticketId: string) {
    const response = await axios.delete(`/ticket/${ticketId}/delete`);
    return response.data;
}
