import { User } from "./UserType";

export interface FinanceOverviewType {
    status: "success";
    data: {
        sales_summary: {
            total_orders: number;
            completed_orders: number;
            total_platform_revenue: number;
            customer_pending_payments: number;
        };
        vendor_summary: {
            unpaid_vendor_earnings: number;
            total_vendors: number;
        };
        wallet_summary: {
            total_earnings_recorded: number;
            total_available_to_withdraw: number;
        };
    };
}

export interface FinanceGraph {
    status: "success";
    data: {
        day: string;
        total: number;
    };
}

export interface SettlementAccount {
    id: number;
    user_id: number;
    name: string;
    code: string;
    institution_number: string;
    transit_number: string;
    account_number: string;
    account_name: string;
}
export interface PayoutItem {
    id: number;
    vendor_id: number;
    settlement_account_id: number;
    amount: string;
    status: string;
    created_at: string;
    updated_at: string;
    vendor: User;
    settlement_account: SettlementAccount;
}

export interface PayoutRequest {
    status: "success";
    data: PayoutItem[];
    summary: {
        total_payout: number;
        pending_payout: string; 
    }
    total: number;
    offset: number;
    limit: number;
}

export interface MetricCardProps {
    title: string;
    value: number | string | undefined;
    icon: React.ReactNode;
    loading: boolean;
    color: string;
}