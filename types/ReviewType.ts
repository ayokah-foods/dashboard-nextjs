import { Product } from "./ProductType";

export default interface ReviewType {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  images: string[];
  image_public_ids: string[];
  rating: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
    google_id: string | null;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
  };
  product: Product;
}

export interface ReviewMetricType {
    rating: number;
    count: number;
}
 