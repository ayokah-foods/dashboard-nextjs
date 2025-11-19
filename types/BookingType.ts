import { User } from "./UserType";

// src/types/BookingType.ts
export interface BookingResponse {
    status: string;
    data: {
        booking: BookingItem;
        stats: BookingStats;
    };
}

export interface BookingItem {
    id: number;
    amount: string;
    delivery_status: string;
    payment_status: string;
    delivery_method: string;
    start_date: string;
    end_date: string;
    created_at: string;
    address: string;
    service: {
        title: string;
        image: string;
    };
    customer: User;
    vendor: User;
    shop: {
        name: string;
        logo: string | null;
    };
}

export interface BookingStats {
    total_bookings: number;
    total_completed: number;
    total_cancelled: number;
    total_revenue: string;
}
