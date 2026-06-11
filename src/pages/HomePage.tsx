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
import FeatureStackAnimation from '../components/ui/FeatureStackAnimation/FeatureStackAnimation';
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
    id: 'search',
    title: 'Encuentra rápido',
    description: 'Búsqueda visible, filtros sencillos y resultados fáciles de revisar.',
    icon: <FaLayerGroup />,
    accent: 'cyan',
  },
  {
    id: 'clarity',
    title: 'Compra con claridad',
    description: 'Precios, disponibilidad y cantidades presentados sin sorpresas.',
    icon: <FaShieldHalved />,
    accent: 'purple',
  },
  {
    id: 'accessibility',
    title: 'Navega a tu manera',
    description: 'Controles accesibles por teclado y preferencias que permanecen contigo.',
    icon: <FaUniversalAccess />,
    accent: 'cyan',
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
        <FeatureStackAnimation
          eyebrow="Una mejor experiencia"
          title="Todo lo importante, fácil de encontrar"
          titleId="experience-title"
          description="La interfaz reduce pasos innecesarios y mantiene las decisiones principales siempre a la vista."
          features={experienceBenefits}
          action={
            <Link to="/accessibility">
              Configurar mi experiencia
              <FaArrowRight aria-hidden="true" />
            </Link>
          }
        />
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
