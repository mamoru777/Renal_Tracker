import { Outlet } from 'react-router';
import { Button } from '@/components/button';
import { PRIME_ICONS } from '@/constants/icons';
import { Sidebar } from '@/modules/sidebar';
import styles from './page-layout.module.css';

export function PageLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Sidebar
          renderToggle={({ toggleSidebar }) => (
            <Button
              onClick={toggleSidebar}
              icon={PRIME_ICONS.THREE_STRIPES}
              aria-label="sidebar"
            />
          )}
        />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        Renal-tracker © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
