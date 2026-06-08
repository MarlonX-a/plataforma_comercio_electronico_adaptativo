import type { ProductComparisonResult } from '../types/product.types';

const comparisonStorageKey = 'comercio-adaptativo-comparison';
export const comparisonUpdatedEventName = 'comparison-updated';
export const maxComparedProducts = 3;

const isProductId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const persistComparedProductIds = (productIds: number[]): void => {
  window.localStorage.setItem(comparisonStorageKey, JSON.stringify(productIds));
  window.dispatchEvent(new Event(comparisonUpdatedEventName));
};

export const loadComparedProductIds = (): number[] => {
  try {
    const storedValue = window.localStorage.getItem(comparisonStorageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as unknown;
    return Array.isArray(parsedValue) ? parsedValue.filter(isProductId).slice(0, maxComparedProducts) : [];
  } catch {
    return [];
  }
};

export const toggleComparedProduct = (productId: number): ProductComparisonResult => {
  const comparedProductIds = loadComparedProductIds();
  const isAlreadySelected = comparedProductIds.includes(productId);

  if (isAlreadySelected) {
    const updatedProductIds = comparedProductIds.filter((selectedId) => selectedId !== productId);
    persistComparedProductIds(updatedProductIds);

    return {
      isSuccess: true,
      message: 'Producto retirado de la comparación.',
      selectedProductIds: updatedProductIds,
    };
  }

  if (comparedProductIds.length >= maxComparedProducts) {
    return {
      isSuccess: false,
      message: `Puedes comparar máximo ${maxComparedProducts} productos a la vez.`,
      selectedProductIds: comparedProductIds,
    };
  }

  const updatedProductIds = [...comparedProductIds, productId];
  persistComparedProductIds(updatedProductIds);

  return {
    isSuccess: true,
    message:
      updatedProductIds.length === 1
        ? 'Producto agregado. Selecciona al menos uno más para comparar.'
        : `${updatedProductIds.length} productos listos para comparar.`,
    selectedProductIds: updatedProductIds,
  };
};

export const removeComparedProduct = (productId: number): ProductComparisonResult => {
  const updatedProductIds = loadComparedProductIds().filter(
    (selectedId) => selectedId !== productId,
  );

  persistComparedProductIds(updatedProductIds);

  return {
    isSuccess: true,
    message: 'Producto retirado de la comparación.',
    selectedProductIds: updatedProductIds,
  };
};

export const clearComparedProducts = (): ProductComparisonResult => {
  persistComparedProductIds([]);

  return {
    isSuccess: true,
    message: 'Comparación limpiada.',
    selectedProductIds: [],
  };
};
