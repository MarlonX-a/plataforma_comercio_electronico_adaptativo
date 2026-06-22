import type { Tables, TablesInsert, TablesUpdate } from '../../../types/database.types';

export type ProductRow = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

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
  isSelectedForComparison?: boolean;
  onToggleCompare?: (productId: number) => void;
};

export type ProductFiltersState = {
  searchTerm: string;
  category: string;
};

export type ProductServiceResult =
  | {
      isSuccess: true;
      products: Product[];
    }
  | {
      isSuccess: false;
      message: string;
      products: [];
    };

export type ProductDetailServiceResult =
  | {
      isSuccess: true;
      product: Product;
    }
  | {
      isSuccess: false;
      message: string;
      product: null;
    };

export type ProductComparisonResult = {
  isSuccess: boolean;
  message: string;
  selectedProductIds: number[];
};

export type ProductManagementFormValues = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: string;
  isActive: boolean;
};

export type ProductManagementFieldErrors = Partial<Record<keyof ProductManagementFormValues, string>>;

export type ProductMutationResult =
  | {
      isSuccess: true;
      message: string;
      product: Product;
    }
  | {
      isSuccess: false;
      message: string;
      product: null;
    };
