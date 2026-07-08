import axios from "@/app/lib/axios";
import { CommissionRevenuesType } from "@/types/CommissionRevenueType";
import {
    FinanceGraph,
    FinanceOverviewType,
    PayoutRequest,
} from "@/types/FinanceType";
import { SettlementAccountType } from "@/types/SettlementAccountType";

export async function getFinanceOverview(params: {
    start_date?: string;
}): Promise<FinanceOverviewType> {
    const response = await axios.get<FinanceOverviewType>(
        "/earnings/overview",
        {
            params,
        }
    );
    return response.data;
}
export async function getFinanceGraph(params: {
    start_date?: string;
}): Promise<FinanceGraph> {
    const response = await axios.get<FinanceGraph>("/earnings/graph", {
        params,
    });
    return response.data;
}

export async function getPayoutRequests(
    limit: number,
    offset: number,
    search?: string
): Promise<PayoutRequest> {
    const response = await axios.get<PayoutRequest>("/withdrawal/requests", {
        params: {
            limit,
            offset,
            ...(search ? { search } : {}),
        },
    });
    return response.data;
}

export async function updatePayoutStatus(id: number, status: string) {
    const response = await axios.put(`/withdrawal/${id}/${status}`);
    return response.data;
}

export async function getCommissionRevenues(
    limit: number,
    offset: number
): Promise<CommissionRevenuesType> {
    const response = await axios.get<CommissionRevenuesType>(
        "/commission/revenues",
        {
            params: {
                limit,
                offset,
            },
        }
    );
    return response.data;
}
export async function getSettlementAccounts(
    limit: number,
    offset: number,
    search?: string
): Promise<SettlementAccountType> {
    const response = await axios.get<SettlementAccountType>(
        "/settlement-accounts",
        {
            params: {
                limit,
                offset,
                ...(search ? { search } : {}),
            },
        }
    );
    return response.data;
}
