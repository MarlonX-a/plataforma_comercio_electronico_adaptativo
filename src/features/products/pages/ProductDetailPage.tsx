import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCartPlus, FaImage } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { addProductToCart } from '../../cart/services/cartService';
import { getActiveProducts, getProductById } from '../services/productService';
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
    recommendations: Product[];
    errorMessage: string;
  }>({
    productId: null,
    product: null,
    recommendations: [],
    errorMessage: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!hasValidProductId) {
      return;
    }

    let isMounted = true;

    Promise.all([getProductById(parsedProductId), getActiveProducts()]).then(
      ([productResult, productsResult]) => {
      if (!isMounted) {
        return;
      }

        const selectedProduct = productResult.product;
        const relatedProducts =
          selectedProduct && productsResult.isSuccess
            ? productsResult.products
                .filter(
                  (candidate) =>
                    candidate.id !== selectedProduct.id &&
                    candidate.category === selectedProduct.category,
                )
                .slice(0, 3)
            : [];

      setRequestState({
        productId: parsedProductId,
          product: selectedProduct,
          recommendations: relatedProducts,
          errorMessage: productResult.isSuccess ? '' : productResult.message,
      });
      },
    );

    return () => {
      isMounted = false;
    };
  }, [hasValidProductId, parsedProductId]);

  const { product, recommendations, errorMessage } = requestState;
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
    <section className={styles.page} aria-labelledby="product-title">
      <Link className={styles.backLink} to="/products">
        <FaArrowLeft aria-hidden="true" />
        Volver al catálogo
      </Link>

      <article className={styles.detail}>
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
      </article>

      {recommendations.length > 0 ? (
        <section className={styles.recommendations} aria-labelledby="recommendations-title">
          <div>
            <p className={styles.category}>También te puede interesar</p>
            <h2 id="recommendations-title">Productos relacionados</h2>
          </div>

          <div className={styles.recommendationGrid}>
            {recommendations.map((recommendedProduct) => {
              const recommendedStock = recommendedProduct.stock ?? 0;
              const canAddRecommendation = recommendedProduct.isActive && recommendedStock > 0;

              return (
                <article className={styles.recommendationCard} key={recommendedProduct.id}>
                  <div>
                    <p>{recommendedProduct.category ?? 'Sin categoría'}</p>
                    <h3>
                      <Link to={`/products/${recommendedProduct.id}`}>
                        {recommendedProduct.name}
                      </Link>
                    </h3>
                    <strong>{formatProductPrice(recommendedProduct.price)}</strong>
                  </div>
                  <button
                    type="button"
                    disabled={!canAddRecommendation}
                    onClick={() => {
                      const result = addProductToCart(recommendedProduct);
                      setStatusMessage(result.message);
                    }}
                  >
                    <FaCartPlus aria-hidden="true" />
                    Agregar
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </section>
  );
}
