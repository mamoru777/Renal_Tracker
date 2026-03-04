import { useCallback, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { Button } from '@/components/button';
import { appRoutes } from '@/constants/routes';
import { defaultLogger } from '@/lib/logger';
import { useUserId } from '@/modules/auth';
import { toastProvider } from '@/modules/toast';
import { useGfrFetcher } from '../../context';
import type { SaveGfrFetcherData } from '../../types';
import styles from './gfr-results.module.css';

export function GfrResultsSaveButton() {
  const userId = useUserId();
  const gfrFetcher = useGfrFetcher();
  const resultsFetcher = useFetcher<SaveGfrFetcherData>();

  const onSaveResultsClick = useCallback(() => {
    if (gfrFetcher.data && 'calcResult' in gfrFetcher.data) {
      resultsFetcher.submit(JSON.stringify(gfrFetcher.data.calcResult), {
        method: 'post',
        action: appRoutes.GFR_SAVE,
        encType: 'application/json',
      });
    }
  }, [resultsFetcher, gfrFetcher.data]);

  useEffect(() => {
    if (!resultsFetcher.data || resultsFetcher.state !== 'idle') {
      return;
    }

    if (
      'error' in resultsFetcher.data &&
      resultsFetcher.data.error instanceof Error
    ) {
      const message = 'Ошибка при сохранении данных анализов';
      defaultLogger.error(message, ': ', resultsFetcher.data.error?.message);
      toastProvider.error({
        text: message,
      });
      return;
    }

    if ('result' in resultsFetcher.data) {
      toastProvider.success({
        text: 'Данные успешно сохранены',
      });
    }
  }, [resultsFetcher.data, resultsFetcher.state]);

  if (!userId || !gfrFetcher.data || !('calcResult' in gfrFetcher.data)) {
    return null;
  }

  return (
    <Button
      htmlType="button"
      onClick={onSaveResultsClick}
      className={styles.saveButton}
      loading={resultsFetcher.state !== 'idle'}
    >
      Сохранить результаты
    </Button>
  );
}
