import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  applyAccessibilitySettings,
  loadAccessibilitySettings,
} from '../../features/accessibility/services/accessibilitySettingsService';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

type AppLayoutProps = {
  children: ReactNode;
};

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/products/')) {
    return 'Detalle del producto';
  }

  const pageTitles: Record<string, string> = {
    '/': 'Inicio',
    '/products': 'Productos',
    '/compare': 'Comparar productos',
    '/cart': 'Carrito',
    '/checkout': 'Finalizar compra',
    '/orders': 'Mis pedidos',
    '/login': 'Iniciar sesión',
    '/register': 'Crear cuenta',
    '/complete-profile': 'Completar perfil',
    '/profile': 'Mi perfil',
    '/accessibility': 'Accesibilidad',
    '/site-map': 'Mapa del sitio',
  };

  return pageTitles[pathname] ?? 'Página no encontrada';
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const mainContentRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    applyAccessibilitySettings(loadAccessibilitySettings());
  }, []);

  useEffect(() => {
    document.title = `${getPageTitle(location.pathname)} | Comercio Adaptativo`;

    if (previousPathnameRef.current === location.pathname) {
      return;
    }

    previousPathnameRef.current = location.pathname;
    window.scrollTo({ top: 0, behavior: 'auto' });

    const focusFrame = window.requestAnimationFrame(() => {
      mainContentRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [location.pathname]);

  return (
    <div className={styles.appLayout}>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main
        ref={mainContentRef}
        id="main-content"
        className={styles.mainContent}
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
