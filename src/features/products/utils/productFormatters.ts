export const formatProductPrice = (price: number): string =>
  new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
