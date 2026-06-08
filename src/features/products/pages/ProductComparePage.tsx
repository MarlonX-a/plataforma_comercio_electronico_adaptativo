import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaBalanceScale, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  clearComparedProducts,
  comparisonUpdatedEventName,
  loadComparedProductIds,
  removeComparedProduct,
} from '../services/productComparisonService';
import { getProductsByIds } from '../services/productService';
import type { Product } from '../types/product.types';
import { formatProductPrice } from '../utils/productFormatters';
import styles from './ProductComparePage.module.css';

export default function ProductComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadComparison = useCallback(async () => {
    const comparedProductIds = loadComparedProductIds();
    const result = await getProductsByIds(comparedProductIds);

    setProducts(result.products);

    if (!result.isSuccess) {
      setStatusMessage(result.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadComparison();
    }, 0);

    const refreshComparison = () => {
      void loadComparison();
    };

    window.addEventListener(comparisonUpdatedEventName, refreshComparison);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(comparisonUpdatedEventName, refreshComparison);
    };
  }, [loadComparison]);

  const handleRemoveProduct = (productId: number) => {
    const result = removeComparedProduct(productId);
    setStatusMessage(result.message);
  };

  const handleClearComparison = () => {
    const result = clearComparedProducts();
    setStatusMessage(result.message);
  };

  if (isLoading) {
    return (
      <section className={styles.feedback} aria-busy="true">
        <p>Cargando comparación...</p>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-labelledby="compare-title">
      <Link className={styles.backLink} to="/products">
        <FaArrowLeft aria-hidden="true" />
        Volver al catálogo
      </Link>

      <header className={styles.header}>
        <p className={styles.kicker}>Decisión de compra</p>
        <h1 id="compare-title">Comparar productos</h1>
        <p>Revisa precio, disponibilidad, categoría y descripción en una sola vista.</p>
      </header>

      <p className={styles.statusMessage} role="status" aria-live="polite">
        {statusMessage}
      </p>

      {products.length < 2 ? (
        <div className={styles.emptyState}>
          <FaBalanceScale aria-hidden="true" />
          <h2>Selecciona al menos dos productos</h2>
          <p>Vuelve al catálogo y marca los productos que quieras comparar.</p>
          <Link to="/products">Seleccionar productos</Link>
        </div>
      ) : (
        <>
          <div className={styles.actions}>
            <button type="button" onClick={handleClearComparison}>
              Limpiar comparación
            </button>
          </div>

          <div className={styles.tableWrapper} tabIndex={0} aria-label="Tabla comparativa">
            <table className={styles.compareTable}>
              <caption>Comparación de {products.length} productos seleccionados</caption>
              <thead>
                <tr>
                  <th scope="col">Criterio</th>
                  {products.map((product) => (
                    <th scope="col" key={product.id}>
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Precio</th>
                  {products.map((product) => (
                    <td key={product.id}>{formatProductPrice(product.price)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Categoría</th>
                  {products.map((product) => (
                    <td key={product.id}>{product.category ?? 'Sin categoría'}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Disponibilidad</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      {(product.stock ?? 0) > 0 ? `${product.stock ?? 0} unidades` : 'Sin stock'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Descripción</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      {product.description ?? 'Sin descripción disponible.'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Acciones</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      <div className={styles.productActions}>
                        <Link to={`/products/${product.id}`}>Ver detalle</Link>
                        <button
                          type="button"
                          aria-label={`Quitar ${product.name} de la comparación`}
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <FaTrash aria-hidden="true" />
                          Quitar
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
