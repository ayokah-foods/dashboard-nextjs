import { User } from "./UserType";

export default interface TicketType {
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
    agent?: User;
    reporter?: User;
    created_at: string;
  }