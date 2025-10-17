import { CategoryType } from "./CategoryType";
import { CityType } from "./CityType";
import { StateType } from "./StateType";
import { User } from "./UserType";

export interface Shop {
    id: number;
    name: string;
    slug: string;
    address: string;
    type: string;
    logo: string | null;
    banner: string | null;
    logo_public_id: string | null;
    banner_public_id: string | null;
    description: string | null;
    subscription_id: number | null;
    state_id: number | null;
    city_id: number | null;
    country_id: number | null;
    vendor_id: number | null;
    category_id: number | null;
    status: string;
    state?: StateType;
    city?: CityType;
    category?: CategoryType;
    vendor?: User;
    products_count: number;
    created_at: string;
    updated_at: string;
}

export interface ShopType {
    message: string;
    status: string;
    total: number;
    limit: number;
    offset: number;
    data: Shop[];
}

export interface ShopMetrics {
    message: string;
    status: string;
    data: {
        total_shops: number;
        active_shops: number;
        inactive_shops: number;
        total_products: number;
        total_services: number;
    };
}

export interface ShopAnalyticsItem {
    day: string;
    total: number;
}

export interface ShopAnalyticsType {
    message: string;
    status: string;
    data: ShopAnalyticsItem[];
}


export interface ShopPerformanceItem {
  id: number;
  name: string;
  slug: string;
  type: string;
  logo: string | null;
  vendor_name: string;
  total_sales_count: number;
  total_sales_amount: number;
  total_orders: number;
  sales_percentage: number;
}

export interface ShopPerformanceType {
  status: "success" | "error";
  total: number;
  limit: number;
  offset: number;
  data: ShopPerformanceItem[];
  message?: string;
}

