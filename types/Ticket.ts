import { User } from "./UserType";

export default interface Ticket {
    id: number;
    title: string;
    ticket_id: string;
    subject: string;
    description: string;
    file: string | null;
    file_public_id: string | null;
    priority_level: string;
    response_status: string;
    reporter_id: number;
    agent_id: number;
    created_at: string;
    updated_at: string;
    reporter: User;
    agent: User;
}

export interface TicketResponse {
    status: "success";
    data: Ticket[];
    total: number;
    limit: number;
    offset: number;
}
