import { Order } from "./OrderType";
import { Product } from "./ProductType";

export default interface CartItem {
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
}
