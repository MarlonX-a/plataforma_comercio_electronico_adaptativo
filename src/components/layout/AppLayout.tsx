import type { ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.appLayout}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
