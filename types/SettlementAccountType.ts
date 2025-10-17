import { User } from "./UserType";

export interface SettlementAccountType {
    status: "success";
    data: SettlementAccountItem[];
    total: number;
    limit: number;
    offset: number;
}

export interface SettlementAccountItem {
    id: number;
    user_id: number;
    name: string;
    code: string;
    institution_number: string;
    transit_number: string;
    account_number: string;
    account_name: string;
    user: User;
    created_at: string;
    updated_at: string;
}
