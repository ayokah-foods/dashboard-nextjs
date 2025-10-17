import Address from "./AddressType";
import { User } from "./UserType";

export type OrderResponse = {
    status: "success";
    data: {
        order_item: OrderItem;
        stats?: {
            total_orders: number;
            total_completed: number;
            total_cancelled: number;
            total_revenue: string;
        } | null;
    };
};

export type OrderItem = {
    id: number;
    order_id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: string;
    subtotal: string;
    created_at: string;
    updated_at: string;
    order: Order;
    product: Product;
};

export type Order = {
    id: number;
    customer_id: number;
    vendor_id: number;
    total: string;
    payment_method: string;
    shipping_status: string;
    shipping_method: string;
    shipping_fee: string;
    tracking_number: string | null;
    tracking_url: string | null;
    shipping_date: string | null;
    delivery_date: string | null;
    payment_date: string;
    payment_reference: string;
    payment_status: string;
    vendor_payment_settlement_status: string;
    cancel_reason: string | null;
    address_id: number;
    created_at: string;
    updated_at: string;
    customer: User;
    address: Address;
    order_items: OrderItem[];
    vendor: User;
    product: Product;
};

export type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    sales_price: string;
    regular_price: string;
    quantity: number;
    notify_user: number;
    images: string[];
    image_public_ids: string[];
    status: string;
    type: string;
    shop_id: number;
    category_id: number;
    available_from: string | null;
    available_to: string | null;
    available_days: string | null;
    estimated_delivery_time: string | null;
    delivery_method: string | null;
    pricing_model: string | null;
    views: number;
    created_at: string;
    updated_at: string;
    shop: Shop;
    average_rating: number;
    vendor: User;
};

export type Shop = {
    id: number;
    name: string;
    slug: string;
    address: string;
    type: string;
    logo: string;
    logo_public_id: string;
    banner: string;
    banner_public_id: string;
    description: string;
    subscription_id: number;
    state_id: string;
    city_id: string;
    country_id: string;
    vendor_id: number;
    category_id: number;
    status: string;
    created_at: string;
    updated_at: string;
};
export type GraphPoint = {
  day: string;  
  total: number; 
};

export type OrderStatsType = {
  total_processing: number;
  total_ongoing: number;
  total_completed: number;
  total_cancelled: number;
};
