import type {
  CartOperationResult,
  CartProductItem,
  CartSummary,
  StoredCartItem,
} from '../types/cart.types';
import type { Product } from '../../products/types/product.types';

const cartStorageKey = 'comercio-adaptativo-cart';
export const cartUpdatedEventName = 'cart-updated';

const isStoredCartItem = (value: unknown): value is StoredCartItem => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const cartItem = value as Record<string, unknown>;
  return (
    typeof cartItem.productId === 'number' &&
    Number.isInteger(cartItem.productId) &&
    typeof cartItem.quantity === 'number' &&
    Number.isInteger(cartItem.quantity) &&
    cartItem.quantity > 0
  );
};

const persistCartItems = (cartItems: StoredCartItem[]): void => {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  window.dispatchEvent(new Event(cartUpdatedEventName));
};

export const loadStoredCartItems = (): StoredCartItem[] => {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart) as unknown;
    return Array.isArray(parsedCart) ? parsedCart.filter(isStoredCartItem) : [];
  } catch {
    return [];
  }
};

export const getCartItemCount = (): number =>
  loadStoredCartItems().reduce((total, cartItem) => total + cartItem.quantity, 0);

export const addProductToCart = (product: Product): CartOperationResult => {
  const availableStock = product.stock ?? 0;

  if (availableStock <= 0) {
    return {
      isSuccess: false,
      message: 'Este producto no tiene existencias disponibles.',
    };
  }

  const cartItems = loadStoredCartItems();
  const existingItem = cartItems.find((cartItem) => cartItem.productId === product.id);

  if (existingItem) {
    if (existingItem.quantity >= availableStock) {
      return {
        isSuccess: false,
        message: 'Ya agregaste la cantidad máxima disponible.',
      };
    }

    existingItem.quantity += 1;
  } else {
    cartItems.push({
      productId: product.id,
      quantity: 1,
    });
  }

  persistCartItems(cartItems);

  return {
    isSuccess: true,
    message: `${product.name} se agregó al carrito.`,
  };
};

export const updateCartItemQuantity = (
  product: Product,
  quantity: number,
): CartOperationResult => {
  const availableStock = product.stock ?? 0;

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > availableStock) {
    return {
      isSuccess: false,
      message: `Selecciona una cantidad entre 1 y ${availableStock}.`,
    };
  }

  const updatedItems = loadStoredCartItems().map((cartItem) =>
    cartItem.productId === product.id ? { ...cartItem, quantity } : cartItem,
  );

  persistCartItems(updatedItems);

  return {
    isSuccess: true,
    message: `Cantidad de ${product.name} actualizada.`,
  };
};

export const removeProductFromCart = (product: Product): CartOperationResult => {
  const updatedItems = loadStoredCartItems().filter(
    (cartItem) => cartItem.productId !== product.id,
  );

  persistCartItems(updatedItems);

  return {
    isSuccess: true,
    message: `${product.name} se eliminó del carrito.`,
  };
};

export const createCartSummary = (
  products: Product[],
  storedCartItems: StoredCartItem[],
): CartSummary => {
  const items: CartProductItem[] = storedCartItems.flatMap((storedItem) => {
    const product = products.find((candidate) => candidate.id === storedItem.productId);

    if (!product) {
      return [];
    }

    return [
      {
        product,
        quantity: storedItem.quantity,
        lineTotal: product.price * storedItem.quantity,
      },
    ];
  });

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  };
};
