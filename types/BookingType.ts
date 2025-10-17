export interface BookingResponse {
  id: number;

  customer: {
    name: string | null;
    photo: string | null;
  } | null;

  vendor: {
    name: string | null;
    photo: string | null;
  } | null;

  service: {
    title: string | null;
    image: string | null;
  } | null;

  total: string | number;
  delivery_status: string;
  payment_status: string;
  created_at: string;
}
