import type { Tables } from '../../../types/database.types';
import type { Product } from '../../products/types/product.types';

export type CartItemRow = Tables<'cart_items'>;

export type CartItem = {
  id: number;
  userId: string | null;
  productId: number | null;
  quantity: number;
  createdAt: string | null;
};

export type CartProductItem = {
  cartItem: CartItem;
  product: Product | null;
};

export type CartSummary = {
  items: CartProductItem[];
  totalItems: number;
  subtotal: number;
};

export type CartQuantityUpdate = {
  cartItemId: number;
  quantity: number;
};
