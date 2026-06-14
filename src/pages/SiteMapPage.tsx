import { Link } from 'react-router-dom';
import uiStyles from '../components/ui/UiPrimitives.module.css';
import styles from './SiteMapPage.module.css';

const siteSections = [
  {
    title: 'Comprar',
    links: [
      { label: 'Página de inicio', path: '/' },
      { label: 'Catálogo de productos', path: '/products' },
      { label: 'Comparar productos', path: '/compare' },
      { label: 'Carrito de compras', path: '/cart' },
      { label: 'Mis pedidos', path: '/orders' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Iniciar sesión', path: '/login' },
      { label: 'Crear una cuenta', path: '/register' },
      { label: 'Completar o editar perfil', path: '/profile' },
    ],
  },
  {
    title: 'Ayuda y preferencias',
    links: [
      { label: 'Centro de ayuda', path: '/help' },
      { label: 'Preferencias de accesibilidad', path: '/accessibility' },
      { label: 'Contactar soporte', path: 'mailto:soporte@comercioadaptativo.local' },
    ],
  },
] as const;

export default function SiteMapPage() {
  return (
    <section className={styles.page} aria-labelledby="site-map-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Orientación</p>
        <h1 id="site-map-title">Mapa del sitio</h1>
        <p>Encuentra las principales páginas de la tienda organizadas por función.</p>
      </header>

      <div className={styles.sectionGrid}>
        {siteSections.map((section) => (
          <section
            className={`${styles.siteSection} ${uiStyles.sectionCard}`}
            key={section.title}
          >
            <h2>{section.title}</h2>
            <ul>
              {section.links.map((link) => (
                <li key={link.path}>
                  {link.path.startsWith('mailto:') ? (
                    <a href={link.path}>{link.label}</a>
                  ) : (
                    <Link to={link.path}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
