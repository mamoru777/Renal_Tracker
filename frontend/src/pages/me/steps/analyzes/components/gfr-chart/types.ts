export type ChartData = {
  gfr: number | undefined;
  age: number | undefined;
  gfrMinimum: number | undefined;
  currency: string | undefined;
  date: string | undefined;
};

export type ChartRawData = {
  x: number | null;
  y: number | null;
  age: number | undefined;
  currency: string | undefined;
};
