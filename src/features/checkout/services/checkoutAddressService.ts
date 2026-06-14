import type { CheckoutFormValues } from '../types/checkout.types';

const CHECKOUT_ADDRESS_STORAGE_KEY = 'checkout_saved_address';

export interface SavedCheckoutAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  savedAt: string;
}

/**
 * Recupera la dirección guardada del localStorage
 * WCAG 3.3.7: Entrada redundante - Reutilizar datos ya guardados
 */
export function getSavedCheckoutAddress(): SavedCheckoutAddress | null {
  try {
    const stored = window.localStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SavedCheckoutAddress;
  } catch {
    return null;
  }
}

/**
 * Guarda la dirección en localStorage para reutilizarla después
 * WCAG 3.3.7: Entrada redundante - Conservar datos entre sesiones
 */
export function saveCheckoutAddress(address: CheckoutFormValues): void {
  try {
    const savedAddress: SavedCheckoutAddress = {
      fullName: address.fullName,
      email: address.email,
      address: address.address,
      city: address.city,
      phone: address.phone,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CHECKOUT_ADDRESS_STORAGE_KEY, JSON.stringify(savedAddress));
  } catch {
    // Silenciosamente ignorar errores de localStorage
  }
}

/**
 * Pre-rellena los valores del formulario con datos guardados y del perfil
 * Prioridad: datos guardados > datos del perfil > vacío
 * WCAG 3.3.7: Entrada redundante
 */
export function getPrefilledCheckoutValues(
  savedAddress: SavedCheckoutAddress | null,
  userEmail?: string,
  userFullName?: string,
): Partial<CheckoutFormValues> {
  const prefilledValues: Partial<CheckoutFormValues> = {};

  // Si hay dirección guardada, usar esos datos (prioridad máxima)
  if (savedAddress) {
    prefilledValues.fullName = savedAddress.fullName;
    prefilledValues.email = savedAddress.email;
    prefilledValues.address = savedAddress.address;
    prefilledValues.city = savedAddress.city;
    prefilledValues.phone = savedAddress.phone;
  } else {
    // Si no hay dirección guardada, usar datos del perfil
    if (userFullName) {
      prefilledValues.fullName = userFullName;
    }
    if (userEmail) {
      prefilledValues.email = userEmail;
    }
  }

  return prefilledValues;
}
