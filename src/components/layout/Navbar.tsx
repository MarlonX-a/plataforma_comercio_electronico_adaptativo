import { NavLink } from 'react-router-dom';
import logoImage from '../../assets/images/LogoPro.png';
import styles from './Navbar.module.css';

const navigationItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/products' },
  { label: 'Carrito', path: '/cart' },
  { label: 'Accesibilidad', path: '/accessibility' },
] as const;

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <NavLink to="/" className={styles.brand} aria-label="Ir al inicio">
          <img src={logoImage} alt="" className={styles.brandLogo} aria-hidden="true" />
          <span className={styles.brandContent}>
            <span className={styles.brandName}>Comercio Adaptativo</span>
            <span className={styles.brandSubtitle}>Tienda accesible</span>
          </span>
        </NavLink>

        <ul className={styles.navList}>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
