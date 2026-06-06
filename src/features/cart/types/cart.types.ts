import type { Tables } from '../../../types/database.types';
import type { Product } from '../../products/types/product.types';

export type CartItemRow = Tables<'cart_items'>;

export type StoredCartItem = {
  productId: number;
  quantity: number;
};

export type CartProductItem = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export type CartSummary = {
  items: CartProductItem[];
  totalItems: number;
  subtotal: number;
};

export type CartOperationResult =
  | {
      isSuccess: true;
      message: string;
    }
  | {
      isSuccess: false;
      message: string;
    };
