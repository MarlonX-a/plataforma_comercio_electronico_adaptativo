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
  paymentMethod: 'card' | 'transfer' | 'cash';
};

export type CheckoutStepKey = 'cart' | 'details' | 'review' | 'confirmation';

export type StoredOrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type StoredOrder = {
  id: string;
  customer: CheckoutFormValues;
  items: StoredOrderItem[];
  totalItems: number;
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
};

export type CheckoutConfirmation = {
  order: StoredOrder;
};

export type CheckoutOperationResult =
  | {
      isSuccess: true;
      message: string;
      confirmation: CheckoutConfirmation;
    }
  | {
      isSuccess: false;
      message: string;
      confirmation: null;
    };

export type OrderHistoryResult = {
  isSuccess: boolean;
  message: string;
  orders: StoredOrder[];
};
