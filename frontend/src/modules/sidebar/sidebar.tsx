import { type ReactNode, useCallback, useState } from 'react';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { Link } from '@/components/link';
import { LogoutButton } from '@/modules/auth';
import { Header } from './components/header';
import styles from './sidebar.module.css';

type Props = {
  renderToggle: (props: { toggleSidebar: () => void }) => ReactNode;
};

export function Sidebar({ renderToggle }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const onHide = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const onToggle = useCallback(() => {
    setIsVisible((open) => !open);
  }, [setIsVisible]);

  const onLogout = useCallback(() => {
    onHide();
  }, [onHide]);

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
