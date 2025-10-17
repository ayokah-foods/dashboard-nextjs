import { User } from "./UserType";

export default interface UnReviewOrderType {
  id: number;
  customer_id: number;
  vendor_id: number | number[];
  total: string;
  payment_method: string;
  shipping_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  customer: User;
  items: {
    id: number;
    order_id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: string;
    subtotal: string;
  }[];
}
