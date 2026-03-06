export interface GfrCalcParams {
  creatinine: number;
  creatinineCurrency: 'mg/dl' | 'mkmol/l';
  weight?: number;
  height?: number;
  sex?: 'male' | 'female';
  age?: number;
  bsa?: number;
  isAbsolute?: boolean;
  creatinineTestDate?: string;
  gfr?: number;
  gfrCurrency?: string;
  gfrMediumEnd?: number;
  gfrMediumStart?: number;
  gfrMinimum?: number;
}
