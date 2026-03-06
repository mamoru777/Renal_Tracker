import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageSection } from '@/components/page-section';
import { Table } from '@/components/table';
import { QK_CURRENT_USER, QK_GFR_RESULTS_LIST } from '@/constants/query-keys';
import { fetchAuthUserGfrResults } from '../../actions';
import { ANALYZES_TABLE_COLUMNS } from './constants';

export function GfrTable() {
  const { data: gfrList } = useQuery({
    queryKey: [QK_CURRENT_USER, QK_GFR_RESULTS_LIST],
    queryFn: fetchAuthUserGfrResults,
  });

  const tableData = useMemo(() => {
    return (gfrList ?? [])
      .slice()
      .sort(
        (a, b) =>
          new Date(a.creatinineTestDate ?? '').valueOf() -
          new Date(b.creatinineTestDate ?? '').valueOf(),
      )
      .map((item) => ({
        ...item,
        creatinineFormatted: `${item.creatinine} ${item.creatinineCurrency}`,
        gfrFormatted: `${item.gfr} ${item.gfrCurrency}`,
        creatinineTestDateFormatted: item.creatinineTestDate
          ? new Date(item.creatinineTestDate).toLocaleDateString()
          : '-',
      }));
  }, [gfrList]);

  if (!tableData.length) {
    return null;
  }

  return (
    <PageSection>
      <Table
        data={tableData}
        columns={ANALYZES_TABLE_COLUMNS}
        rowsPerPage={10}
      />
    </PageSection>
  );
}
