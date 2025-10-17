import axios from "@/app/lib/axios";
import { GraphPoint, OrderResponse, OrderStatsType } from "@/types/OrderType";

export async function getRecentBookings(
    limit: number,
    offset: number,
    search?: string,
    status?: string
) {
    const response = await axios.get("/bookings", {
        params: { limit, offset, search, status },
    });
    return response.data;
}
 

export async function getBookingDetail(bookingId: string): Promise<OrderResponse> {
    const response = await axios.get<OrderResponse>(`/bookings/${bookingId}`);
    return response.data;
}

export async function changeOrderStatus(orderId: number, status: string) {
    const response = await axios.put(`/orders/${orderId}/status`, {
        status,
    });
    return response.data;
}
export async function changeOrderPaymentStatus(orderId: number, status: string) {
    const response = await axios.put(`/orders/${orderId}/payment-status`, {
        payment_status: status,
    });
    return response.data;
}

export async function getOrderGraph(start_date?: string): Promise<GraphPoint[]> {
  const response = await axios.get<GraphPoint[]>(`/orders/graph`, {
    params: { start_date },
  });
  return response.data;
}
export async function getBookingGraph(start_date?: string): Promise<GraphPoint[]> {
  const response = await axios.get<GraphPoint[]>(`/bookings/graph`, {
    params: { start_date },
  });
  return response.data;
}

export async function orderStats(): Promise<OrderStatsType> {
  const response = await axios.get<OrderStatsType>(`/orders/stats`);
  return response.data;
}
export async function bookingStats(): Promise<OrderStatsType> {
  const response = await axios.get<OrderStatsType>(`/bookings/stats`);
  return response.data;
}

export async function getSalesGraph(period: string) {
    const response = await axios.get(
        `/stats/graph?start_date=${period}`
    );
    return response;
}

export async function getStats(period: string) {
    const response = await axios.get(`/stats?start_date=${period}`);
    return response.data;
}

