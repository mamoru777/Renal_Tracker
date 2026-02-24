import { PageSection } from '@/components/page-section';
import { Skeleton } from '@/components/skeleton';
import styles from './me.module.css';

export function MeSkeleton() {
  return (
    <PageSection>
      <h1>Данные пользователя</h1>

      <div className={styles.form}>
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
        <Skeleton width="30%" height="1.5rem" className={styles.skeleton} />
      </div>
    </PageSection>
  );
}
