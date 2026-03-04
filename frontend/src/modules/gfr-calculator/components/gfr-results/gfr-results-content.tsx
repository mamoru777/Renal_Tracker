import cn from 'classnames';
import { useGfrFetcher } from '../../context';
import { GfrResultsSkeleton } from './gfr-results.skeleton';
import styles from './gfr-results.module.css';

export function GfrResultsContent() {
  const fetcher = useGfrFetcher();

  if (fetcher.state !== 'idle') {
    return <GfrResultsSkeleton />;
  }

  if (!fetcher.data) {
    return null;
  }

  if ('error' in fetcher.data) {
    return <span className={styles.text}>{fetcher.data.error.message}</span>;
  }

  const { gfr, gfrCurrency, gfrMediumEnd, gfrMediumStart } =
    fetcher.data.calcResult;

  if ([gfr, gfrMediumEnd, gfrMediumStart].some((v) => typeof v !== 'number')) {
    return (
      <span className={styles.text}>
        Расчет выполнен некорректно, пожалуйста, повторите попытку
      </span>
    );
  }

  const isInBounds = gfrMediumStart! <= gfr!;

  return (
    <span className={styles.text}>
      <b
        className={cn(styles.value, {
          [styles.success]: isInBounds,
          [styles.fail]: !isInBounds,
        })}
      >
        {gfr}{' '}
      </b>
      {gfrCurrency}
      <br />
      Норма:{' '}
      <b>
        {gfrMediumStart} - {gfrMediumEnd} ({gfrCurrency})
      </b>
    </span>
  );
}
