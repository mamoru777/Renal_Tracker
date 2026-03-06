import { Skeleton } from '@/components/skeleton';
import styles from './gfr-results.module.css';

export function GfrResultsSkeleton() {
  return (
    <div style={{ minWidth: '100%' }}>
      <Skeleton className={styles.skeleton} height="1.5rem" width="100px" />
      <Skeleton className={styles.skeleton} height="1.5rem" width="350px" />
    </div>
  );
}
