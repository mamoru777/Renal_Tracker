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
    return fetcher.data.error.message;
  }

  const { gfr, gfrCurrency, gfrMediumEnd, gfrMediumStart } =
    fetcher.data.calcResult;

  if ([gfr, gfrMediumEnd, gfrMediumStart].some((v) => typeof v !== 'number')) {
    return 'Расчет выполнен некорректно, пожалуйста, повторите попытку';
  }

  const isInBounds = gfrMediumStart! <= gfr!;

  return (
    <>
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
    </>
  );
}
