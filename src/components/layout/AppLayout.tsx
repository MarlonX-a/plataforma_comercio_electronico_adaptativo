import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  applyAccessibilitySettings,
  loadAccessibilitySettings,
} from '../../features/accessibility/services/accessibilitySettingsService';
import FloatingAccessibilityMenu from '../../features/accessibility/components/FloatingAccessibilityMenu';
import StoreAssistantChat from '../../features/assistant/components/StoreAssistantChat';
import { useI18n } from '../../features/i18n/I18nProvider';
import KeyboardShortcutsHelp from '../../features/keyboard-shortcuts/components/KeyboardShortcutsHelp';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

type AppLayoutProps = {
  children: ReactNode;
};

const getPageTitle = (pathname: string, t: ReturnType<typeof useI18n>['t']): string => {
  if (pathname.startsWith('/products/')) {
    return t('layout.page.productDetail');
  }

  const pageTitles: Record<string, string> = {
    '/': t('layout.page.home'),
    '/products': t('layout.page.products'),
    '/compare': t('layout.page.compare'),
    '/cart': t('layout.page.cart'),
    '/checkout': t('layout.page.checkout'),
    '/orders': t('layout.page.orders'),
    '/login': t('layout.page.login'),
    '/register': t('layout.page.register'),
    '/complete-profile': t('layout.page.completeProfile'),
    '/profile': t('layout.page.profile'),
    '/worker/products': t('layout.page.workerProducts'),
    '/seller/products': t('layout.page.sellerProducts'),
    '/seller/products/new': t('layout.page.addProduct'),
    '/help': t('layout.page.help'),
    '/site-map': t('layout.page.siteMap'),
  };

  return pageTitles[pathname] ?? t('layout.page.notFound');
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { t } = useI18n();
  const mainContentRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    applyAccessibilitySettings(loadAccessibilitySettings());
  }, []);

  useEffect(() => {
    document.title = `${getPageTitle(location.pathname, t)} | ${t('app.name')}`;

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
  }, [location.pathname, t]);

  return (
    <div className={styles.appLayout}>
      <a className={styles.skipLink} href="#main-content">
        {t('layout.skipToMain')}
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
      <KeyboardShortcutsHelp />
      <StoreAssistantChat />
      <FloatingAccessibilityMenu />
    </div>
  );
}
