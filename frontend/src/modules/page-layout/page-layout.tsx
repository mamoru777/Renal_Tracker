import { usePrefetchQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { Button } from '@/components/button';
import { QK_CURRENT_USER, QK_USER } from '@/constants/query-keys';
import { Sidebar } from '@/modules/sidebar';
import { fetchAuthUserInfo } from '@/modules/user';
import styles from './page-layout.module.css';

export function PageLayout() {
  usePrefetchQuery({
    queryKey: [QK_USER, QK_CURRENT_USER],
    queryFn: fetchAuthUserInfo,
  });

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Sidebar
          renderToggle={({ toggleSidebar }) => (
            <Button
              onClick={toggleSidebar}
              icon="pi pi-bars"
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
