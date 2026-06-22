import { supabase } from '../../../lib/supabaseClient';
import type { UserRole } from '../../auth/types/auth.types';
import type {
  ProductInsert,
  ProductManagementFieldErrors,
  ProductManagementFormValues,
  ProductMutationResult,
  ProductServiceResult,
  ProductUpdate,
} from '../types/product.types';
import { mapProduct } from './productService';

export const emptyProductManagementFormValues: ProductManagementFormValues = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: '',
  stock: '',
  isActive: true,
};

export const canManageProducts = (role: UserRole | null | undefined): boolean =>
  role === 'worker' || role === 'admin';

const normalizeOptionalText = (value: string): string | null => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const validateProductManagementForm = (
  values: ProductManagementFormValues,
): ProductManagementFieldErrors => {
  const errors: ProductManagementFieldErrors = {};
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (!values.name.trim()) {
    errors.name = 'Escribe el nombre del producto.';
  }

  if (!Number.isFinite(price) || price <= 0) {
    errors.price = 'Ingresa un precio mayor a 0.';
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = 'Ingresa un stock entero igual o mayor a 0.';
  }

  if (values.imageUrl.trim() && !/^https?:\/\//i.test(values.imageUrl.trim())) {
    errors.imageUrl = 'Usa una URL que empiece con http:// o https://.';
  }

  return errors;
};

const toProductInsert = (values: ProductManagementFormValues): ProductInsert => ({
  name: values.name.trim(),
  description: normalizeOptionalText(values.description),
  price: Number(values.price),
  image_url: normalizeOptionalText(values.imageUrl),
  category: normalizeOptionalText(values.category),
  stock: Number(values.stock),
  is_active: values.isActive,
});

const toProductUpdate = (values: ProductManagementFormValues): ProductUpdate => ({
  name: values.name.trim(),
  description: normalizeOptionalText(values.description),
  price: Number(values.price),
  image_url: normalizeOptionalText(values.imageUrl),
  category: normalizeOptionalText(values.category),
  stock: Number(values.stock),
  is_active: values.isActive,
});

export const mapProductToManagementForm = (productId: number, products: ProductServiceResult) => {
  if (!products.isSuccess) {
    return emptyProductManagementFormValues;
  }

  const product = products.products.find((candidate) => candidate.id === productId);

  if (!product) {
    return emptyProductManagementFormValues;
  }

  return {
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    imageUrl: product.imageUrl ?? '',
    category: product.category ?? '',
    stock: String(product.stock ?? 0),
    isActive: product.isActive,
  };
};

export async function getManageableProducts(): Promise<ProductServiceResult> {
  const { data, error } = await supabase.from('products').select('*').order('create_at', {
    ascending: false,
  });

  if (error) {
    return {
      isSuccess: false,
      message: 'No se pudo cargar el inventario. Revisa las políticas RLS para trabajadores.',
      products: [],
    };
  }

  return {
    isSuccess: true,
    products: data.map(mapProduct),
  };
}

export async function createManagedProduct(
  values: ProductManagementFormValues,
): Promise<ProductMutationResult> {
  const { data, error } = await supabase
    .from('products')
    .insert(toProductInsert(values))
    .select('*')
    .single();

  if (error) {
    return {
      isSuccess: false,
      message: 'No se pudo crear el producto. Revisa las políticas RLS para trabajadores.',
      product: null,
    };
  }

  return {
    isSuccess: true,
    message: 'Producto creado correctamente.',
    product: mapProduct(data),
  };
}

export async function updateManagedProduct(
  productId: number,
  values: ProductManagementFormValues,
): Promise<ProductMutationResult> {
  const { data, error } = await supabase
    .from('products')
    .update(toProductUpdate(values))
    .eq('id', productId)
    .select('*')
    .single();

  if (error) {
    return {
      isSuccess: false,
      message: 'No se pudo actualizar el producto. Revisa las políticas RLS para trabajadores.',
      product: null,
    };
  }

  return {
    isSuccess: true,
    message: 'Producto actualizado correctamente.',
    product: mapProduct(data),
  };
}
