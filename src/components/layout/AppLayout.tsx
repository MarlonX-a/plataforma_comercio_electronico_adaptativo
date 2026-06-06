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
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
