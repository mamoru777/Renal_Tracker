import { type ReactNode, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { Link } from '@/components/link';
import { QK_CURRENT_USER, QK_USER } from '@/constants/query-keys';
import { LogoutButton } from '@/modules/auth';
import { Header } from './components/header';
import styles from './sidebar.module.css';

type Props = {
  renderToggle: (props: { toggleSidebar: () => void }) => ReactNode;
};

export function Sidebar({ renderToggle }: Props) {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);

  const onHide = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const onToggle = useCallback(() => {
    setIsVisible((open) => !open);
  }, [setIsVisible]);

  const onLogout = useCallback(() => {
    onHide();
    queryClient.invalidateQueries({ queryKey: [QK_USER, QK_CURRENT_USER] });
  }, [onHide, queryClient]);

  return (
    <>
      <PrimeSidebar onHide={onHide} visible={isVisible} header={<Header />}>
        <div className={styles.sidebar}>
          <div>
            <h2>Меню</h2>
          </div>

          <nav className={styles.nav}>
            <Link onClick={onHide} href="/" type="transparent">
              Домой
            </Link>
            <Link onClick={onHide} href="/me" type="transparent">
              Личный кабинет
            </Link>
            <Link onClick={onHide} href="/about" type="transparent">
              О проекте
            </Link>
          </nav>

          <div className={styles.footer}>
            <LogoutButton onClick={onLogout} />
          </div>
        </div>
      </PrimeSidebar>
      {renderToggle({ toggleSidebar: onToggle })}
    </>
  );
}
