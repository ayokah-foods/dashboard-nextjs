import { Transaction } from "./TransactionType";

export interface CommissionRevenuesType {
    status: "success";
    total_revenue: number;
    limit: number;
    offset: number;
    total: number;
    data: CommissionRevenueItem[];
}

export interface CommissionRevenueItem {
    id: number;
    amount: string;
    source: string;
    reference: string;
    transaction_id: number;
    created_at: string;
    transaction: Transaction;
}

