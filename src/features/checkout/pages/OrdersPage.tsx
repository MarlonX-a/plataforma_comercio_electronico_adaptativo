import { FaBoxOpen, FaClock, FaTruckFast } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { getOrderHistory } from '../services/checkoutService';
import type { StoredOrder } from '../types/checkout.types';
import { formatProductPrice } from '../../products/utils/productFormatters';
import styles from './OrdersPage.module.css';

const formatOrderDate = (date: string): string =>
  new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const getOrderStatusLabel = (order: StoredOrder): string => {
  if (order.status === 'paid') {
    return 'Pago confirmado';
  }

  if (order.status === 'completed') {
    return 'Entregado';
  }

  if (order.status === 'cancelled') {
    return 'Cancelado';
  }

  return 'Pendiente';
};

export default function OrdersPage() {
  const orderHistory = getOrderHistory();

  return (
    <section className={styles.page} aria-labelledby="orders-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Seguimiento</p>
        <h1 id="orders-title">Mis pedidos</h1>
        <p>Consulta el estado de tus compras recientes y la fecha estimada de entrega.</p>
      </header>

      {orderHistory.orders.length === 0 ? (
        <div className={styles.emptyState}>
          <FaBoxOpen aria-hidden="true" />
          <h2>Aún no tienes pedidos</h2>
          <p>Cuando confirmes una compra, aparecerá aquí con su seguimiento.</p>
          <Link to="/products">Explorar productos</Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orderHistory.orders.map((order) => (
            <article className={styles.orderCard} key={order.id}>
              <div className={styles.orderHeader}>
                <div>
                  <p>{order.id}</p>
                  <h2>{getOrderStatusLabel(order)}</h2>
                </div>
                <span>{formatProductPrice(order.subtotal)}</span>
              </div>

              <ol className={styles.timeline} aria-label={`Seguimiento del pedido ${order.id}`}>
                <li data-state="done">
                  <FaClock aria-hidden="true" />
                  <div>
                    <strong>Pedido recibido</strong>
                    <span>{formatOrderDate(order.createdAt)}</span>
                  </div>
                </li>
                <li data-state="done">
                  <FaBoxOpen aria-hidden="true" />
                  <div>
                    <strong>Preparando productos</strong>
                    <span>{order.totalItems} productos en revisión</span>
                  </div>
                </li>
                <li>
                  <FaTruckFast aria-hidden="true" />
                  <div>
                    <strong>Entrega estimada</strong>
                    <span>{formatOrderDate(order.estimatedDelivery)}</span>
                  </div>
                </li>
              </ol>

              <details className={styles.details}>
                <summary>Ver productos del pedido</summary>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.productId}`}>
                      <span>
                        {item.productName}
                        <small>Cantidad: {item.quantity}</small>
                      </span>
                      <strong>{formatProductPrice(item.lineTotal)}</strong>
                    </li>
                  ))}
                </ul>
              </details>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
