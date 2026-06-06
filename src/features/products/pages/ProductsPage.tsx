import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { addProductToCart } from '../../cart/services/cartService';
import ProductCard from '../components/ProductCard';
import { getActiveProducts } from '../services/productService';
import type { Product, ProductFiltersState } from '../types/product.types';
import styles from './ProductsPage.module.css';

const initialFilters: ProductFiltersState = {
  searchTerm: '',
  category: 'Todas',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getActiveProducts().then((result) => {
      if (!isMounted) {
        return;
      }

      setProducts(result.products);
      setErrorMessage(result.isSuccess ? '' : result.message);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      'Todas',
      ...Array.from(
        new Set(
          products
            .map((product) => product.category?.trim())
            .filter((category): category is string => Boolean(category)),
        ),
      ).sort(),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.searchTerm.trim().toLocaleLowerCase('es');

    return products.filter((product) => {
      const matchesCategory =
        filters.category === 'Todas' || product.category === filters.category;
      const searchableText = `${product.name} ${product.description ?? ''} ${
        product.category ?? ''
      }`.toLocaleLowerCase('es');
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [filters, products]);

  const handleAddToCart = (productId: number) => {
    const product = products.find((candidate) => candidate.id === productId);

    if (!product) {
      setStatusMessage('No se pudo identificar el producto seleccionado.');
      return;
    }

    const result = addProductToCart(product);
    setStatusMessage(result.message);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setStatusMessage('Búsqueda y filtros restablecidos.');
  };

  return (
    <section className={styles.page} aria-labelledby="products-title">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Catálogo</p>
          <h1 id="products-title">Encuentra tu próximo producto</h1>
          <p>Busca por nombre o descripción y filtra el catálogo por categoría.</p>
        </div>

        <form className={styles.filters} role="search" onSubmit={(event) => event.preventDefault()}>
          <div className={styles.searchField}>
            <label htmlFor="product-search">Buscar productos</label>
            <div className={styles.searchInput}>
              <FaSearch aria-hidden="true" />
              <input
                id="product-search"
                type="search"
                placeholder="Ejemplo: audífonos"
                value={filters.searchTerm}
                onChange={(event) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    searchTerm: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className={styles.categoryField}>
            <label htmlFor="product-category">Categoría</label>
            <select
              id="product-category"
              value={filters.category}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  category: event.target.value,
                }))
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.clearButton} type="button" onClick={clearFilters}>
            <FaTimes aria-hidden="true" />
            Limpiar
          </button>
        </form>
      </header>

      <div className={styles.resultsHeader}>
        <p aria-live="polite">
          {isLoading
            ? 'Cargando productos...'
            : `${filteredProducts.length} ${
                filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'
              }`}
        </p>
        <p className={styles.statusMessage} role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>

      {errorMessage ? (
        <div className={styles.feedback} role="alert">
          <h2>No pudimos mostrar el catálogo</h2>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredProducts.length === 0 ? (
        <div className={styles.feedback}>
          <h2>Sin resultados</h2>
          <p>Prueba con otro término o selecciona una categoría diferente.</p>
          <button type="button" onClick={clearFilters}>
            Mostrar todos los productos
          </button>
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
