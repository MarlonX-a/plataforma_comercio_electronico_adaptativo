import { supabase } from '../../../lib/supabaseClient';
import type {
  Product,
  ProductDetailServiceResult,
  ProductRow,
  ProductServiceResult,
} from '../types/product.types';

const mapProduct = (productRow: ProductRow): Product => ({
  id: productRow.id,
  name: productRow.name,
  description: productRow.description,
  price: productRow.price,
  imageUrl: productRow.image_url,
  category: productRow.category,
  stock: productRow.stock,
  isActive: productRow.is_active ?? false,
});

export async function getActiveProducts(): Promise<ProductServiceResult> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    return {
      isSuccess: false,
      message: 'No pudimos cargar los productos. Intenta nuevamente.',
      products: [],
    };
  }

  return {
    isSuccess: true,
    products: data.map(mapProduct),
  };
}

export async function getProductById(productId: number): Promise<ProductDetailServiceResult> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return {
      isSuccess: false,
      message: 'El producto no existe o ya no está disponible.',
      product: null,
    };
  }

  return {
    isSuccess: true,
    product: mapProduct(data),
  };
}

export async function getProductsByIds(productIds: number[]): Promise<ProductServiceResult> {
  if (productIds.length === 0) {
    return {
      isSuccess: true,
      products: [],
    };
  }

  const { data, error } = await supabase.from('products').select('*').in('id', productIds);

  if (error) {
    return {
      isSuccess: false,
      message: 'No pudimos cargar los productos del carrito.',
      products: [],
    };
  }

  return {
    isSuccess: true,
    products: data.map(mapProduct),
  };
}
