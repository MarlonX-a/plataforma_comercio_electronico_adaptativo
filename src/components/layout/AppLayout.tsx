import { useEffect } from 'react';
import type { ReactNode } from 'react';
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

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    applyAccessibilitySettings(loadAccessibilitySettings());
  }, []);

  return (
    <div className={styles.appLayout}>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" className={styles.mainContent} tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
