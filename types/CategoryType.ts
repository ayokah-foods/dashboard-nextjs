export interface CategoryType {
    id: number;
    name: string;
    type?: "products" | "services";
    image?: string | null;
    image_public_id?: string | null;
    slug: string;
    description?: string;
    status?: "active" | "inactive";
    parent_id: number | null;
    parent_name: string | null;
    created_at?: string;
    updated_at?: string;
    children?: CategoryType[]; // Recursive structure for subcategories
}
export interface CategoryResponse {
    status: "success";
    data: CategoryType[];
    total: number;
    limit: number;
    offset: number;
    stats: CategoryStats;
}

export interface CategoryStats {
    total_product: number;
    total_service: number;
    total_items: number;
    total_active: number;
    total_inactive: number;
}

export interface SubCategoryResponse {
    status: "success";
    data: CategoryType[];
    total: number;
    limit: number;
    offset: number;
}
export interface FlattenedSubCategory {
    id: number;
    name: string;
    slug: string;
    parent_id: number;
    parent_name: string;
    parent_slug: string;
}

export interface BannerType {
    id: number;
    type: string;
    name: string;
    banner_public_id: string;
    banner: string;
    created_at: string;
    updated_at: string;
}
export interface CategoryAnalyticsItem {
    id: number;
    name: string;
    slug: string;
    type: string;
    total_sales_count: string;
    total_sales_amount: string;
    total_orders: number;
}

export interface CategoryAnalyticsType {
    status: string;
    total: number;
    limit: number;
    offset: number;
    data: CategoryAnalyticsItem[];
}
