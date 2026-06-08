import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FaCircleCheck, FaHeadset, FaLock, FaTruckFast } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import {
  createCartSummary,
  loadStoredCartItems,
} from '../../cart/services/cartService';
import type { CartSummary } from '../../cart/types/cart.types';
import { getProductsByIds } from '../../products/services/productService';
import { formatProductPrice } from '../../products/utils/productFormatters';
import {
  createCheckoutOrder,
  validateCheckoutForm,
} from '../services/checkoutService';
import type {
  CheckoutConfirmation,
  CheckoutFormValues,
  CheckoutStepKey,
} from '../types/checkout.types';
import styles from './CheckoutPage.module.css';

const emptyCartSummary: CartSummary = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const initialCheckoutValues: CheckoutFormValues = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  phone: '',
  paymentMethod: 'card',
};

const checkoutSteps: Array<{ key: CheckoutStepKey; label: string }> = [
  { key: 'cart', label: 'Carrito' },
  { key: 'details', label: 'Datos' },
  { key: 'review', label: 'Resumen' },
  { key: 'confirmation', label: 'Confirmación' },
];

const getStepState = (step: CheckoutStepKey, activeStep: CheckoutStepKey): string => {
  const currentIndex = checkoutSteps.findIndex((checkoutStep) => checkoutStep.key === activeStep);
  const stepIndex = checkoutSteps.findIndex((checkoutStep) => checkoutStep.key === step);

  if (stepIndex < currentIndex) {
    return 'Completado';
  }

  return stepIndex === currentIndex ? 'Actual' : 'Pendiente';
};

export default function CheckoutPage() {
  const [cartSummary, setCartSummary] = useState<CartSummary>(emptyCartSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutValues, setCheckoutValues] = useState<CheckoutFormValues>(initialCheckoutValues);
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmation, setConfirmation] = useState<CheckoutConfirmation | null>(null);

  const loadCheckoutCart = useCallback(async () => {
    const storedItems = loadStoredCartItems();
    const result = await getProductsByIds(storedItems.map((item) => item.productId));

    setCartSummary(createCartSummary(result.products, storedItems));
    setStatusMessage(result.isSuccess ? '' : result.message);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadCheckoutCart();
    }, 0);

    return () => {
      window.clearTimeout(initialLoad);
    };
  }, [loadCheckoutCart]);

  const formErrors = useMemo(
    () => validateCheckoutForm(checkoutValues),
    [checkoutValues],
  );
  const canConfirmOrder = formErrors.length === 0 && cartSummary.items.length > 0;
  const activeStep: CheckoutStepKey = confirmation ? 'confirmation' : 'details';

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setCheckoutValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = createCheckoutOrder(checkoutValues, cartSummary);
    setStatusMessage(result.message);
    setConfirmation(result.confirmation);
  };

  if (isLoading) {
    return (
      <section className={styles.feedback} aria-busy="true">
        <p>Preparando el proceso de compra...</p>
      </section>
    );
  }

  if (confirmation) {
    return (
      <section className={styles.page} aria-labelledby="confirmation-title">
        <div className={styles.confirmation}>
          <FaCircleCheck aria-hidden="true" />
          <p className={styles.kicker}>Compra confirmada</p>
          <h1 id="confirmation-title">Tu pedido está en camino</h1>
          <p>
            Pedido <strong>{confirmation.order.id}</strong> registrado correctamente. Puedes
            consultar el seguimiento desde tus pedidos.
          </p>
          <div className={styles.confirmationActions}>
            <Link to="/orders">Ver seguimiento</Link>
            <Link to="/products">Seguir comprando</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-labelledby="checkout-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Pago simple y seguro</p>
        <h1 id="checkout-title">Finalizar compra</h1>
        <p>Completa tus datos, revisa el resumen y confirma el pedido en pocos pasos.</p>
      </header>

      <ol className={styles.stepGuide} aria-label="Guía del proceso de compra">
        {checkoutSteps.map((step, index) => (
          <li key={step.key} data-state={getStepState(step.key, activeStep)}>
            <span aria-hidden="true">{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <small>{getStepState(step.key, activeStep)}</small>
            </div>
          </li>
        ))}
      </ol>

      {cartSummary.items.length === 0 ? (
        <div className={styles.feedback}>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos antes de iniciar el pago.</p>
          <Link to="/products">Ver productos</Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formIntro}>
              <h2>Datos de entrega</h2>
              <p>Los campos obligatorios ayudan a evitar errores en la compra.</p>
            </div>

            <label>
              Nombre completo
              <input
                type="text"
                autoComplete="name"
                placeholder="Ejemplo: Marlon Alvia"
                value={checkoutValues.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                autoComplete="email"
                placeholder="Ejemplo: usuario@correo.com"
                value={checkoutValues.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </label>

            <label>
              Dirección
              <input
                type="text"
                autoComplete="street-address"
                placeholder="Ejemplo: Av. Principal y Calle 10"
                value={checkoutValues.address}
                onChange={(event) => updateField('address', event.target.value)}
              />
            </label>

            <div className={styles.inlineFields}>
              <label>
                Ciudad
                <input
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Ejemplo: Portoviejo"
                  value={checkoutValues.city}
                  onChange={(event) => updateField('city', event.target.value)}
                />
              </label>
              <label>
                Teléfono
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Ejemplo: 0999999999"
                  value={checkoutValues.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </label>
            </div>

            <fieldset className={styles.paymentOptions}>
              <legend>Método de pago</legend>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={checkoutValues.paymentMethod === 'card'}
                  onChange={(event) => updateField('paymentMethod', event.target.value)}
                />
                Tarjeta segura
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={checkoutValues.paymentMethod === 'transfer'}
                  onChange={(event) => updateField('paymentMethod', event.target.value)}
                />
                Transferencia
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={checkoutValues.paymentMethod === 'cash'}
                  onChange={(event) => updateField('paymentMethod', event.target.value)}
                />
                Pago contra entrega
              </label>
            </fieldset>

            <div className={styles.formHelp} role="status" aria-live="polite">
              {formErrors.length > 0 ? (
                <ul>
                  {formErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : (
                <p>Datos listos para revisar y confirmar.</p>
              )}
            </div>

            <button type="submit" disabled={!canConfirmOrder}>
              Confirmar pedido
            </button>

            <p className={styles.statusMessage} role="status" aria-live="polite">
              {statusMessage}
            </p>
          </form>

          <aside className={styles.summary} aria-labelledby="review-title">
            <h2 id="review-title">Resumen de compra</h2>
            <ul>
              {cartSummary.items.map((item) => (
                <li key={item.product.id}>
                  <span>
                    {item.product.name}
                    <small>Cantidad: {item.quantity}</small>
                  </span>
                  <strong>{formatProductPrice(item.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>Productos</dt>
                <dd>{cartSummary.totalItems}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatProductPrice(cartSummary.subtotal)}</dd>
              </div>
            </dl>

            <div className={styles.trustBox}>
              <FaLock aria-hidden="true" />
              <p>Pago simulado para demostración. No se solicita información bancaria real.</p>
            </div>

            <div className={styles.helpBox} aria-labelledby="checkout-help-title">
              <FaHeadset aria-hidden="true" />
              <div>
                <h3 id="checkout-help-title">¿Necesitas ayuda?</h3>
                <p>Soporte disponible para guiarte durante la compra.</p>
                <a href="mailto:soporte@comercioadaptativo.local">Contactar soporte</a>
              </div>
            </div>

            <div className={styles.deliveryBox}>
              <FaTruckFast aria-hidden="true" />
              <p>Entrega estimada: 3 días laborables después de confirmar.</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
