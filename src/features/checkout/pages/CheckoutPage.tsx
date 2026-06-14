import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { FaCircleCheck, FaHeadset, FaLock, FaTruckFast } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import uiStyles from '../../../components/ui/UiPrimitives.module.css';
import { createCartSummary, loadStoredCartItems } from '../../cart/services/cartService';
import type { CartSummary } from '../../cart/types/cart.types';
import { getCurrentAuthSession, getUserProfile } from '../../auth/services/authService';
import { getProductsByIds } from '../../products/services/productService';
import { formatProductPrice } from '../../products/utils/productFormatters';
import {
  getPrefilledCheckoutValues,
  getSavedCheckoutAddress,
  saveCheckoutAddress,
} from '../services/checkoutAddressService';
import { createCheckoutOrder, validateCheckoutFields } from '../services/checkoutService';
import type {
  CheckoutConfirmation,
  CheckoutFieldName,
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
  { key: 'review', label: 'Revisión' },
  { key: 'confirmation', label: 'Confirmación' },
];

const paymentMethodLabels: Record<CheckoutFormValues['paymentMethod'], string> = {
  card: 'Tarjeta segura',
  transfer: 'Transferencia',
  cash: 'Pago contra entrega',
};

const fieldOrder: CheckoutFieldName[] = ['fullName', 'email', 'address', 'city', 'phone'];

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
  const [activeStep, setActiveStep] = useState<CheckoutStepKey>('details');
  const [hasAttemptedReview, setHasAttemptedReview] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const reviewTitleRef = useRef<HTMLHeadingElement>(null);
  const confirmationTitleRef = useRef<HTMLHeadingElement>(null);

  const loadCheckoutCart = useCallback(async () => {
    const storedItems = loadStoredCartItems();
    const result = await getProductsByIds(storedItems.map((item) => item.productId));

    setCartSummary(createCartSummary(result.products, storedItems));
    setStatusMessage(result.isSuccess ? '' : result.message);
    setIsLoading(false);
  }, []);

  const loadUserDataForCheckout = useCallback(async () => {
    try {
      const savedAddress = getSavedCheckoutAddress();
      const session = await getCurrentAuthSession();
      let userFullName: string | undefined;

      if (session?.userId) {
        const profileResult = await getUserProfile(session.userId);
        userFullName = profileResult?.fullName ?? undefined;
      }

      const prefilledValues = getPrefilledCheckoutValues(
        savedAddress,
        session?.email ?? undefined,
        userFullName,
      );

      setCheckoutValues((current) => ({
        ...current,
        ...prefilledValues,
      }));
    } catch {
      // Silenciosamente ignorar errores en la carga de datos
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadCheckoutCart();
    }, 0);

    return () => {
      window.clearTimeout(initialLoad);
    };
  }, [loadCheckoutCart]);

  useEffect(() => {
    if (!isLoading) {
      void loadUserDataForCheckout();
    }
  }, [isLoading, loadUserDataForCheckout]);

  useEffect(() => {
    if (activeStep === 'review') {
      reviewTitleRef.current?.focus();
    }

    if (activeStep === 'confirmation') {
      confirmationTitleRef.current?.focus();
    }
  }, [activeStep]);

  const fieldErrors = useMemo(
    () => validateCheckoutFields(checkoutValues),
    [checkoutValues],
  );
  const errorMessages = fieldOrder.flatMap((field) =>
    fieldErrors[field] ? [fieldErrors[field]] : [],
  );

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setCheckoutValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const getFieldDescription = (field: CheckoutFieldName): string =>
    hasAttemptedReview && fieldErrors[field]
      ? `checkout-${field}-error`
      : 'checkout-form-instructions';

  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedReview(true);
    setStatusMessage('');

    if (errorMessages.length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setActiveStep('review');
  };

  const handleConfirmOrder = () => {
    const result = createCheckoutOrder(checkoutValues, cartSummary);
    setStatusMessage(result.message);
    setConfirmation(result.confirmation);

    if (result.isSuccess) {
      // Guardar la dirección para reutilizarla en futuros checkouts (WCAG 3.3.7)
      saveCheckoutAddress(checkoutValues);
      setActiveStep('confirmation');
    }
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
        <div className={`${styles.confirmation} ${uiStyles.formCard}`}>
          <FaCircleCheck aria-hidden="true" />
          <p className={styles.kicker}>Compra confirmada</p>
          <h1 ref={confirmationTitleRef} id="confirmation-title" tabIndex={-1}>
            Tu pedido está en camino
          </h1>
          <p role="status">
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
      ) : activeStep === 'review' ? (
        <div className={`${styles.reviewPanel} ${uiStyles.formCard}`}>
          <div>
            <p className={styles.kicker}>Comprueba antes de confirmar</p>
            <h2 ref={reviewTitleRef} id="checkout-review-title" tabIndex={-1}>
              Revisa los datos del pedido
            </h2>
            <p>Puedes volver y corregir cualquier dato antes de registrar la compra.</p>
          </div>

          <dl className={styles.reviewDetails}>
            <div>
              <dt>Nombre</dt>
              <dd>{checkoutValues.fullName}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{checkoutValues.email}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>
                {checkoutValues.address}, {checkoutValues.city}
              </dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>{checkoutValues.phone}</dd>
            </div>
            <div>
              <dt>Método de pago</dt>
              <dd>{paymentMethodLabels[checkoutValues.paymentMethod]}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatProductPrice(cartSummary.subtotal)}</dd>
            </div>
          </dl>

          <div className={styles.reviewActions}>
            <button
              type="button"
              className={`${styles.secondaryButton} ${uiStyles.secondaryButton}`}
              onClick={() => setActiveStep('details')}
            >
              Editar datos
            </button>
            <button
              type="button"
              className={`${styles.primaryButton} ${uiStyles.primaryButton}`}
              onClick={handleConfirmOrder}
            >
              Confirmar y registrar pedido
            </button>
          </div>

          <p className={styles.statusMessage} role="status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      ) : (
        <div className={styles.layout}>
          <form
            className={`${styles.form} ${uiStyles.formCard}`}
            onSubmit={handleReview}
            noValidate
          >
            <div id="checkout-form-instructions" className={styles.formIntro}>
              <h2>Datos de entrega</h2>
              <p>Todos los campos son obligatorios. Después podrás revisar y corregir los datos.</p>
            </div>

            {hasAttemptedReview && errorMessages.length > 0 ? (
              <div
                ref={errorSummaryRef}
                className={styles.errorSummary}
                role="alert"
                tabIndex={-1}
              >
                <strong>Revisa los siguientes campos:</strong>
                <ul>
                  {fieldOrder.map((field) =>
                    fieldErrors[field] ? (
                      <li key={field}>
                        <a href={`#checkout-${field}`}>{fieldErrors[field]}</a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}

            <label className={uiStyles.formGroup} htmlFor="checkout-fullName">
              Nombre completo
              <input
                className={uiStyles.formInput}
                id="checkout-fullName"
                name="name"
                type="text"
                autoComplete="name"
                aria-invalid={hasAttemptedReview && Boolean(fieldErrors.fullName)}
                aria-describedby={getFieldDescription('fullName')}
                placeholder="Ejemplo: Marlon Alvia"
                value={checkoutValues.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                required
              />
              {hasAttemptedReview && fieldErrors.fullName ? (
                <span id="checkout-fullName-error" className={styles.fieldError}>
                  {fieldErrors.fullName}
                </span>
              ) : null}
            </label>

            <label className={uiStyles.formGroup} htmlFor="checkout-email">
              Correo electrónico
              <input
                className={uiStyles.formInput}
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={hasAttemptedReview && Boolean(fieldErrors.email)}
                aria-describedby={getFieldDescription('email')}
                placeholder="Ejemplo: usuario@correo.com"
                value={checkoutValues.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />
              {hasAttemptedReview && fieldErrors.email ? (
                <span id="checkout-email-error" className={styles.fieldError}>
                  {fieldErrors.email}
                </span>
              ) : null}
            </label>

            <label className={uiStyles.formGroup} htmlFor="checkout-address">
              Dirección
              <input
                className={uiStyles.formInput}
                id="checkout-address"
                name="street-address"
                type="text"
                autoComplete="street-address"
                aria-invalid={hasAttemptedReview && Boolean(fieldErrors.address)}
                aria-describedby={getFieldDescription('address')}
                placeholder="Ejemplo: Av. Principal y Calle 10"
                value={checkoutValues.address}
                onChange={(event) => updateField('address', event.target.value)}
                required
              />
              {hasAttemptedReview && fieldErrors.address ? (
                <span id="checkout-address-error" className={styles.fieldError}>
                  {fieldErrors.address}
                </span>
              ) : null}
            </label>

            <div className={styles.inlineFields}>
              <label className={uiStyles.formGroup} htmlFor="checkout-city">
                Ciudad
                <input
                  className={uiStyles.formInput}
                  id="checkout-city"
                  name="address-level2"
                  type="text"
                  autoComplete="address-level2"
                  aria-invalid={hasAttemptedReview && Boolean(fieldErrors.city)}
                  aria-describedby={getFieldDescription('city')}
                  placeholder="Ejemplo: Portoviejo"
                  value={checkoutValues.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  required
                />
                {hasAttemptedReview && fieldErrors.city ? (
                  <span id="checkout-city-error" className={styles.fieldError}>
                    {fieldErrors.city}
                  </span>
                ) : null}
              </label>

              <label className={uiStyles.formGroup} htmlFor="checkout-phone">
                Teléfono
                <input
                  className={uiStyles.formInput}
                  id="checkout-phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={hasAttemptedReview && Boolean(fieldErrors.phone)}
                  aria-describedby={getFieldDescription('phone')}
                  placeholder="Ejemplo: 0999999999"
                  value={checkoutValues.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                />
                {hasAttemptedReview && fieldErrors.phone ? (
                  <span id="checkout-phone-error" className={styles.fieldError}>
                    {fieldErrors.phone}
                  </span>
                ) : null}
              </label>
            </div>

            <fieldset className={styles.paymentOptions}>
              <legend>Método de pago</legend>
              {Object.entries(paymentMethodLabels).map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={checkoutValues.paymentMethod === value}
                    onChange={(event) => updateField('paymentMethod', event.target.value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            <button className={uiStyles.primaryButton} type="submit">
              Revisar pedido
            </button>
          </form>

          <aside
            className={`${styles.summary} ${uiStyles.sectionCard}`}
            aria-labelledby="review-title"
          >
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
