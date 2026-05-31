import type { Tables } from '../../../types/database.types';

export type OrderRow = Tables<'orders'>;
export type OrderItemRow = Tables<'order_items'>;

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'completed';

export type Order = {
  id: number;
  userId: string | null;
  total: number;
  status: OrderStatus | null;
  createdAt: string | null;
};

export type OrderItem = {
  id: number;
  orderId: number | null;
  productId: number | null;
  quantity: number;
  price: number;
};

export type CheckoutFormValues = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
};

export type CheckoutSummary = {
  order: Order;
  items: OrderItem[];
};
