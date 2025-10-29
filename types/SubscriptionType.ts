export interface SubscriptionType {
  id?: number;
  name: string;
  monthly_price: number;
  yearly_price: number;
  features: string;
  payment_link: string;
}
