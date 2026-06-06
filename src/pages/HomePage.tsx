import {
  FaArrowRight,
  FaCartShopping,
  FaLayerGroup,
  FaMagnifyingGlass,
  FaShieldHalved,
  FaUniversalAccess,
  FaUserPlus,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/LogoPro.png';
import styles from './HomePage.module.css';

const quickActions = [
  {
    title: 'Explorar productos',
    description: 'Busca, compara y encuentra productos por categoría.',
    path: '/products',
    linkLabel: 'Ir al catálogo',
    icon: FaMagnifyingGlass,
  },
  {
    title: 'Revisar mi carrito',
    description: 'Consulta tus productos y modifica las cantidades fácilmente.',
    path: '/cart',
    linkLabel: 'Abrir carrito',
    icon: FaCartShopping,
  },
  {
    title: 'Crear una cuenta',
    description: 'Guarda tu perfil y prepara una experiencia más personal.',
    path: '/register',
    linkLabel: 'Registrarme',
    icon: FaUserPlus,
  },
  {
    title: 'Personalizar accesibilidad',
    description: 'Ajusta contraste, tamaño del texto, espaciado y movimiento.',
    path: '/accessibility',
    linkLabel: 'Ver preferencias',
    icon: FaUniversalAccess,
  },
] as const;

const experienceBenefits = [
  {
    title: 'Encuentra rápido',
    description: 'Búsqueda visible, filtros sencillos y resultados fáciles de revisar.',
    icon: FaLayerGroup,
  },
  {
    title: 'Compra con claridad',
    description: 'Precios, disponibilidad y cantidades presentados sin sorpresas.',
    icon: FaShieldHalved,
  },
  {
    title: 'Navega a tu manera',
    description: 'Controles accesibles por teclado y preferencias que permanecen contigo.',
    icon: FaUniversalAccess,
  },
] as const;

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroContent}>
          <img
            className={styles.heroLogo}
            src={logoImage}
            alt="Logotipo de Comercio Adaptativo"
          />
          <p className={styles.kicker}>Una tienda diseñada para todas las personas</p>
          <h1 id="home-title">Comercio Adaptativo</h1>
          <p className={styles.summary}>
            Descubre productos con una experiencia clara, rápida y personalizable, pensada para
            que comprar sea sencillo desde el primer momento.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to="/products">
              Ver productos
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} to="/login">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.quickAccess} aria-labelledby="quick-access-title">
        <div className={styles.sectionHeading}>
          <p>Accesos directos</p>
          <h2 id="quick-access-title">¿Qué deseas hacer?</h2>
        </div>

        <div className={styles.actionGrid}>
          {quickActions.map(({ title, description, path, linkLabel, icon: ActionIcon }) => (
            <article className={styles.actionCard} key={path}>
              <span className={styles.actionIcon} aria-hidden="true">
                <ActionIcon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link to={path}>
                {linkLabel}
                <FaArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.experience} aria-labelledby="experience-title">
        <div className={styles.experienceIntro}>
          <p>Una mejor experiencia</p>
          <h2 id="experience-title">Todo lo importante, fácil de encontrar</h2>
          <p>
            La interfaz reduce pasos innecesarios y mantiene las decisiones principales siempre a
            la vista.
          </p>
          <Link to="/accessibility">
            Configurar mi experiencia
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.benefitList}>
          {experienceBenefits.map(({ title, description, icon: BenefitIcon }) => (
            <article className={styles.benefit} key={title}>
              <BenefitIcon aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <div>
          <p>Tu próxima compra comienza aquí</p>
          <h2 id="closing-title">Explora el catálogo a tu ritmo</h2>
        </div>
        <Link to="/products">
          Comenzar ahora
          <FaArrowRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
