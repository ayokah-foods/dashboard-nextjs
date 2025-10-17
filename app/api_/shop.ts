import { ShopAnalyticsType, ShopMetrics, ShopPerformanceType, ShopType } from "@/types/ShopType";
import axios from "@/app/lib/axios";

export async function getShops(params: {
    limit: number;
    offset: number;
    type?: string;
    search?: string;
}): Promise<ShopType> {
    const response = await axios.get<ShopType>("/shops", {
        params,
    });
    return response.data;
}

export async function shopMetrics(): Promise<ShopMetrics> {
    const response = await axios.get<ShopMetrics>(`/shops-metrics`);
    return response.data;
}

export async function shopAnalytics(params?: {
    selectedPeriod?: string;
}): Promise<ShopAnalyticsType> {
    const response = await axios.get<ShopAnalyticsType>("/shops-analytics", {
        params,
    });
    return response.data;
}


export async function mostSellingShops(params: { limit: number; offset: number }): Promise<ShopPerformanceType> {
  const response = await axios.get<ShopPerformanceType>(`/shops/most-selling`, {
    params,
  });
  return response.data;
}
