import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Chart } from '@/components/chart';
import { PageSection } from '@/components/page-section';
import { QK_CURRENT_USER, QK_GFR_RESULTS_LIST } from '@/constants/query-keys';
import { fetchAuthUserGfrResults } from '../../actions';
import { CHART_OPTIONS } from './constants';
import type { ChartData } from './types';

export function GfrChart() {
  const { data: gfrList } = useSuspenseQuery({
    queryKey: [QK_CURRENT_USER, QK_GFR_RESULTS_LIST],
    queryFn: fetchAuthUserGfrResults,
  });

  const data = useMemo(() => {
    const results = gfrList
      .slice()
      .sort(
        (a, b) =>
          new Date(a.creatinineTestDate ?? '').valueOf() -
          new Date(b.creatinineTestDate ?? '').valueOf(),
      )
      .filter(({ age }) => age)
      .map<ChartData>(
        ({ age, gfr, gfrMinimum, gfrCurrency, creatinineTestDate }) => ({
          gfr,
          age,
          gfrMinimum,
          currency: gfrCurrency,
          date: creatinineTestDate,
        }),
      );

    return {
      datasets: [
        {
          label: 'Показатель СКФ пациента',
          data: results.map(({ gfr, currency, date, age }) => ({
            y: gfr ?? null,
            x: age ?? null,
            currency,
            date,
          })),
          type: 'scatter' as const,
          borderColor: 'red',
          tension: 0.2,
          showLine: true,
        },
        {
          label: 'Возрастной показатель СКФ',
          data: results.map(({ gfrMinimum, currency, date, age }) => ({
            y: gfrMinimum ?? null,
            x: age ?? null,
            currency,
            date,
          })),
          type: 'scatter' as const,
          borderColor: 'blue',
          tension: 0.2,
          showLine: true,
        },
      ],
    };
  }, [gfrList]);

  return (
    <PageSection>
      <Chart data={data} options={CHART_OPTIONS} type="scatter" />
    </PageSection>
  );
}
