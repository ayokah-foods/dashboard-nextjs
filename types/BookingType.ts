import { Product, Shop } from "./OrderType";
import { User } from "./UserType";

export interface BookingResponse {
    id: number;

    customer: User;

    shop: Shop;

    service: Product;

    total: string | number;
    delivery_status: string;
    payment_status: string;
    created_at: string;
}
