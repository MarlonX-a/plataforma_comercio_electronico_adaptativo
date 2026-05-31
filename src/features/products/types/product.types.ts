import type { Tables } from '../../../types/database.types';

export type ProductRow = Tables<'products'>;

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  stock: number | null;
  isActive: boolean;
};

export type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: number) => void;
};
