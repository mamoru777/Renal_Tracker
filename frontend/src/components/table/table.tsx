import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

type TableColumnItem<T, U extends keyof T> = {
  header?: string;
  sortable?: boolean;
  valuePath: U;
  key: string;
};

type Props<T extends object> = {
  className?: string;
  columns: TableColumnItem<T, keyof T extends string ? keyof T : never>[];
  data: T[];
  rowsPerPage?: number;
};

export function Table<T extends object>({
  className,
  columns,
  data,
  rowsPerPage = 0,
}: Props<T>) {
  return (
    <DataTable
      className={className}
      value={data}
      rows={rowsPerPage}
      paginator={Boolean(rowsPerPage)}
    >
      {columns.map(({ valuePath, header, key }) => (
        <Column key={key} header={header} field={valuePath} />
      ))}
    </DataTable>
  );
}
