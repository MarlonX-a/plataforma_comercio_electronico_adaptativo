import { clearCart } from '../../cart/services/cartService';
import type { CartSummary } from '../../cart/types/cart.types';
import type {
  CheckoutFormValues,
  CheckoutOperationResult,
  OrderHistoryResult,
  StoredOrder,
} from '../types/checkout.types';

const orderStorageKey = 'comercio-adaptativo-orders';

const isStoredOrder = (value: unknown): value is StoredOrder => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.id === 'string' &&
    typeof order.createdAt === 'string' &&
    typeof order.estimatedDelivery === 'string' &&
    typeof order.status === 'string' &&
    Array.isArray(order.items) &&
    typeof order.subtotal === 'number' &&
    typeof order.totalItems === 'number'
  );
};

const loadStoredOrders = (): StoredOrder[] => {
  try {
    const storedOrders = window.localStorage.getItem(orderStorageKey);

    if (!storedOrders) {
      return [];
    }

    const parsedOrders = JSON.parse(storedOrders) as unknown;
    return Array.isArray(parsedOrders) ? parsedOrders.filter(isStoredOrder) : [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (orders: StoredOrder[]): void => {
  window.localStorage.setItem(orderStorageKey, JSON.stringify(orders));
};

const createOrderId = (): string =>
  `CA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

const createEstimatedDelivery = (): string => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  return deliveryDate.toISOString();
};

export const validateCheckoutForm = (values: CheckoutFormValues): string[] => {
  const errors: string[] = [];

  if (values.fullName.trim().length < 3) {
    errors.push('Ingresa tu nombre completo.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.push('Ingresa un correo electrónico válido.');
  }

  if (values.address.trim().length < 8) {
    errors.push('Ingresa una dirección más específica.');
  }

  if (values.city.trim().length < 2) {
    errors.push('Ingresa la ciudad de entrega.');
  }

  if (!/^[0-9+\-\s()]{7,}$/.test(values.phone.trim())) {
    errors.push('Ingresa un teléfono válido para confirmar la entrega.');
  }

  return errors;
};

export const createCheckoutOrder = (
  values: CheckoutFormValues,
  cartSummary: CartSummary,
): CheckoutOperationResult => {
  const formErrors = validateCheckoutForm(values);

  if (cartSummary.items.length === 0) {
    formErrors.push('Agrega al menos un producto al carrito antes de comprar.');
  }

  if (formErrors.length > 0) {
    return {
      isSuccess: false,
      message: formErrors.join(' '),
      confirmation: null,
    };
  }

  const order: StoredOrder = {
    id: createOrderId(),
    customer: {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      phone: values.phone.trim(),
      paymentMethod: values.paymentMethod,
    },
    items: cartSummary.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineTotal: item.lineTotal,
    })),
    totalItems: cartSummary.totalItems,
    subtotal: cartSummary.subtotal,
    status: 'paid',
    createdAt: new Date().toISOString(),
    estimatedDelivery: createEstimatedDelivery(),
  };

  saveStoredOrders([order, ...loadStoredOrders()]);
  clearCart();

  return {
    isSuccess: true,
    message: `Pedido ${order.id} confirmado correctamente.`,
    confirmation: { order },
  };
};

export const getOrderHistory = (): OrderHistoryResult => ({
  isSuccess: true,
  message: 'Pedidos cargados correctamente.',
  orders: loadStoredOrders(),
});
