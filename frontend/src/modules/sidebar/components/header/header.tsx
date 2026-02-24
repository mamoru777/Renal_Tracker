import { Suspense } from 'react';
import { useUserId } from '@/modules/auth';
import { useAuthenticatedUser } from '@/modules/user';
import { HeaderSkeleton } from './header.skeleton';
import styles from './header.module.css';

function HeaderComponent() {
  const { user } = useAuthenticatedUser();

  return (
    <span className={styles.name}>
      {user.surname} {user.name}
    </span>
  );
}

export function Header() {
  const userId = useUserId();

  if (!userId) {
    return <div />;
  }

  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderComponent />
    </Suspense>
  );
}
