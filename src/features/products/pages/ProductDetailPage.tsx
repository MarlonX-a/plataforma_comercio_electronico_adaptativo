import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCartPlus, FaImage } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { addProductToCart } from '../../cart/services/cartService';
import { getProductById } from '../services/productService';
import type { Product } from '../types/product.types';
import { formatProductPrice } from '../utils/productFormatters';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const parsedProductId = Number(productId);
  const hasValidProductId = Number.isInteger(parsedProductId) && parsedProductId > 0;
  const [requestState, setRequestState] = useState<{
    productId: number | null;
    product: Product | null;
    errorMessage: string;
  }>({
    productId: null,
    product: null,
    errorMessage: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!hasValidProductId) {
      return;
    }

    let isMounted = true;

    getProductById(parsedProductId).then((result) => {
      if (!isMounted) {
        return;
      }

      setRequestState({
        productId: parsedProductId,
        product: result.product,
        errorMessage: result.isSuccess ? '' : result.message,
      });
    });

    return () => {
      isMounted = false;
    };
  }, [hasValidProductId, parsedProductId]);

  const { product, errorMessage } = requestState;
  const isLoading = hasValidProductId && requestState.productId !== parsedProductId;

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const result = addProductToCart(product);
    setStatusMessage(result.message);
  };

  if (!hasValidProductId) {
    return (
      <section className={styles.feedback} aria-labelledby="product-error-title">
        <h1 id="product-error-title">Producto no disponible</h1>
        <p>El identificador del producto no es válido.</p>
        <Link to="/products">
          <FaArrowLeft aria-hidden="true" />
          Volver al catálogo
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className={styles.feedback} aria-busy="true" aria-label="Cargando producto">
        <p>Cargando información del producto...</p>
      </section>
    );
  }

  if (!product || errorMessage) {
    return (
      <section className={styles.feedback} aria-labelledby="product-error-title">
        <h1 id="product-error-title">Producto no disponible</h1>
        <p>{errorMessage}</p>
        <Link to="/products">
          <FaArrowLeft aria-hidden="true" />
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const availableStock = product.stock ?? 0;
  const isAvailable = availableStock > 0;

  return (
    <article className={styles.page} aria-labelledby="product-title">
      <Link className={styles.backLink} to="/products">
        <FaArrowLeft aria-hidden="true" />
        Volver al catálogo
      </Link>

      <div className={styles.detail}>
        <div className={styles.media}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <span className={styles.imagePlaceholder} aria-label="Producto sin imagen disponible">
              <FaImage aria-hidden="true" />
            </span>
          )}
        </div>

        <div className={styles.information}>
          <p className={styles.category}>{product.category ?? 'Sin categoría'}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className={styles.description}>
            {product.description ?? 'Este producto todavía no tiene una descripción disponible.'}
          </p>

          <dl className={styles.facts}>
            <div>
              <dt>Precio</dt>
              <dd>{formatProductPrice(product.price)}</dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>{isAvailable ? `${availableStock} unidades` : 'Sin existencias'}</dd>
            </div>
          </dl>

          <button
            className={styles.addButton}
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
          >
            <FaCartPlus aria-hidden="true" />
            {isAvailable ? 'Agregar al carrito' : 'Producto agotado'}
          </button>

          <p className={styles.statusMessage} role="status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </div>
    </article>
  );
}
