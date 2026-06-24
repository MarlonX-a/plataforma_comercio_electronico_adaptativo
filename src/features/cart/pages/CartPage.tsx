import { useCallback, useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AccessibleConfirmDialog from '../../../components/ui/AccessibleConfirmDialog';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import { useAccessibilityPreferences } from '../../accessibility/hooks/useAccessibilityPreferences';
import {
  cartUpdatedEventName,
  createCartSummary,
  loadStoredCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
} from '../services/cartService';
import type { CartSummary } from '../types/cart.types';
import { getProductsByIds } from '../../products/services/productService';
import { formatProductPrice } from '../../products/utils/productFormatters';
import styles from './CartPage.module.css';

const emptyCartSummary: CartSummary = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

export default function CartPage() {
  const [cartSummary, setCartSummary] = useState<CartSummary>(emptyCartSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingRemovalProductId, setPendingRemovalProductId] = useState<number | null>(null);
  const statusMessageRef = useRef<HTMLParagraphElement>(null);
  const shouldFocusStatusRef = useRef(false);
  const { preferences } = useAccessibilityPreferences();

  const loadCart = useCallback(async () => {
    const storedItems = loadStoredCartItems();
    const result = await getProductsByIds(storedItems.map((item) => item.productId));

    setCartSummary(createCartSummary(result.products, storedItems));
    setErrorMessage(result.isSuccess ? '' : result.message);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadCart();
    }, 0);

    const refreshCart = () => {
      void loadCart();
    };

    window.addEventListener(cartUpdatedEventName, refreshCart);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(cartUpdatedEventName, refreshCart);
    };
  }, [loadCart]);

  useEffect(() => {
    if (!statusMessage || !shouldFocusStatusRef.current) {
      return;
    }

    shouldFocusStatusRef.current = false;
    statusMessageRef.current?.focus();
  }, [statusMessage]);

  const changeQuantity = (productId: number, quantity: number) => {
    const cartItem = cartSummary.items.find((item) => item.product.id === productId);

    if (!cartItem) {
      return;
    }

    const result = updateCartItemQuantity(cartItem.product, quantity);
    setStatusMessage(result.message);
  };

  const removeProductImmediately = (productId: number) => {
    const cartItem = cartSummary.items.find((item) => item.product.id === productId);

    if (!cartItem) {
      return;
    }

    const result = removeProductFromCart(cartItem.product);
    shouldFocusStatusRef.current = true;
    setStatusMessage(result.message);
  };

  const removeProduct = (productId: number) => {
    if (preferences.confirmationMode) {
      setPendingRemovalProductId(productId);
      return;
    }

    removeProductImmediately(productId);
  };

  const pendingRemovalItem = pendingRemovalProductId
    ? cartSummary.items.find((item) => item.product.id === pendingRemovalProductId)
    : null;

  if (isLoading) {
    return (
      <section className={styles.feedback} aria-busy="true">
        <p>Cargando carrito...</p>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-labelledby="cart-title">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Tu selección</p>
          <h1 id="cart-title">Carrito de compras</h1>
        </div>
        <p>
          {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      <p
        ref={statusMessageRef}
        className={styles.statusMessage}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {statusMessage}
      </p>

      {errorMessage ? (
        <div className={styles.feedback} role="alert">
          <h2>No pudimos cargar el carrito</h2>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {!errorMessage && cartSummary.items.length === 0 ? (
        <div className={styles.emptyState}>
          <FaShoppingCart aria-hidden="true" />
          <h2>Tu carrito está vacío</h2>
          <p>Explora el catálogo y agrega productos para continuar.</p>
          <Link to="/products">Ver productos</Link>
        </div>
      ) : null}

      {cartSummary.items.length > 0 ? (
        <div className={styles.layout}>
          <ul className={styles.itemList}>
            {cartSummary.items.map((item) => {
              const availableStock = item.product.stock ?? 0;

              return (
                <li
                  key={item.product.id}
                  className={`${styles.item} ${uiStyles.sectionCard}`}
                >
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt="" />
                  ) : (
                    <span className={styles.imagePlaceholder} aria-hidden="true">
                      <FaShoppingCart />
                    </span>
                  )}

                  <div className={styles.itemInformation}>
                    <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                    <span>{formatProductPrice(item.product.price)} por unidad</span>
                  </div>

                  <div
                    className={styles.quantityControl}
                    role="group"
                    aria-label={`Cantidad de ${item.product.name}`}
                  >
                    <button
                      type="button"
                      aria-label={`Disminuir cantidad de ${item.product.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() => changeQuantity(item.product.id, item.quantity - 1)}
                    >
                      <FaMinus aria-hidden="true" />
                    </button>
                    <output aria-live="polite">{item.quantity}</output>
                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.product.name}`}
                      disabled={item.quantity >= availableStock}
                      onClick={() => changeQuantity(item.product.id, item.quantity + 1)}
                    >
                      <FaPlus aria-hidden="true" />
                    </button>
                  </div>

                  <strong className={styles.lineTotal}>{formatProductPrice(item.lineTotal)}</strong>

                  <button
                    className={styles.removeButton}
                    type="button"
                    aria-label={`Eliminar ${item.product.name} del carrito`}
                    onClick={() => removeProduct(item.product.id)}
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>

          <aside
            className={`${styles.summary} ${uiStyles.sectionCard}`}
            aria-labelledby="cart-summary-title"
          >
            <h2 id="cart-summary-title">Resumen</h2>
            <dl>
              <div>
                <dt>Productos</dt>
                <dd>{cartSummary.totalItems}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatProductPrice(cartSummary.subtotal)}</dd>
              </div>
            </dl>
            <p>Los costos de envío se calcularán en el siguiente paso.</p>
            <Link className={uiStyles.primaryButton} to="/checkout">
              Continuar al pago
            </Link>
          </aside>
        </div>
      ) : null}

      <AccessibleConfirmDialog
        isOpen={pendingRemovalItem !== null}
        title="Confirmar eliminación"
        description={
          pendingRemovalItem
            ? `¿Deseas eliminar ${pendingRemovalItem.product.name} del carrito? Esta acción actualizará tu selección.`
            : '¿Deseas eliminar este producto del carrito?'
        }
        confirmLabel="Eliminar producto"
        cancelLabel="Cancelar"
        onCancel={() => setPendingRemovalProductId(null)}
        onConfirm={() => {
          if (pendingRemovalProductId !== null) {
            removeProductImmediately(pendingRemovalProductId);
          }

          setPendingRemovalProductId(null);
        }}
      />
    </section>
  );
}
