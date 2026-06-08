import { FaBalanceScale, FaCartPlus, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { ProductCardProps } from '../types/product.types';
import { formatProductPrice } from '../utils/productFormatters';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  onAddToCart,
  isSelectedForComparison = false,
  onToggleCompare,
}: ProductCardProps) {
  const availableStock = product.stock ?? 0;
  const isAvailable = product.isActive && availableStock > 0;

  return (
    <article className={styles.card}>
      <Link
        to={`/products/${product.id}`}
        className={styles.imageLink}
        aria-label={`Ver detalles de ${product.name}`}
      >
        {product.imageUrl ? (
          <img className={styles.image} src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className={styles.imagePlaceholder} aria-label="Producto sin imagen disponible">
            <FaImage aria-hidden="true" />
          </span>
        )}
      </Link>

      <div className={styles.content}>
        <p className={styles.category}>{product.category ?? 'Sin categoría'}</p>
        <h2 className={styles.name}>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h2>
        <p className={styles.description}>
          {product.description ?? 'Consulta los detalles y disponibilidad de este producto.'}
        </p>

        <div className={styles.footer}>
          <div>
            <strong className={styles.price}>{formatProductPrice(product.price)}</strong>
            <span className={isAvailable ? styles.stockAvailable : styles.stockUnavailable}>
              {isAvailable ? `${availableStock} disponibles` : 'Sin existencias'}
            </span>
          </div>

          <div className={styles.actions}>
            {onToggleCompare ? (
              <button
                className={`${styles.compareButton} ${
                  isSelectedForComparison ? styles.compareButtonActive : ''
                }`}
                type="button"
                aria-pressed={isSelectedForComparison}
                aria-label={
                  isSelectedForComparison
                    ? `Quitar ${product.name} de la comparación`
                    : `Comparar ${product.name}`
                }
                onClick={() => onToggleCompare(product.id)}
              >
                <FaBalanceScale aria-hidden="true" />
                {isSelectedForComparison ? 'Quitar' : 'Comparar'}
              </button>
            ) : null}

            <button
              className={styles.addButton}
              type="button"
              disabled={!isAvailable}
              onClick={() => onAddToCart(product.id)}
            >
              <FaCartPlus aria-hidden="true" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
