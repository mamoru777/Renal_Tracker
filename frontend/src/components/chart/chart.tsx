import type {
  ChartDataCustomTypesPerDataset,
  ChartOptions,
  Point,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart as PrimeChart } from 'primereact/chart';

type Props<T extends 'line' | 'pie' | 'scatter', D, L> = {
  className?: string;
  type: T;
  data: ChartDataCustomTypesPerDataset<T, D, L>;
  options?: ChartOptions<T>;
};

export function Chart<
  T extends 'line' | 'pie' | 'scatter',
  D extends Point[],
  L,
>({ className, type, data, options }: Props<T, D, L>) {
  return (
    <PrimeChart
      className={className}
      data={data}
      options={options}
      type={type}
    />
  );
}
