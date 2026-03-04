import type { GfrCalcParams } from '@/models/gfr-params';

export type UnauthCalcForm = {
  creatinine: number;
  creatinineCurrency: 'mg/dl' | 'mkmol/l';
  weight?: number;
  height?: number;
  sex?: 'male' | 'female';
  age?: number;
  isAbsolute?: boolean;
};

export type AuthCalcForm = {
  creatinine: number;
  creatinineCurrency: 'mg/dl' | 'mkmol/l';
  weight?: number;
  height?: number;
  isAbsolute?: boolean;
  sex?: 'male' | 'female';
  age?: number;
  creatinineTestDate?: Date;
};

export type GfrFetcherData = { calcResult: GfrCalcParams } | { error: Error };
export type SaveGfrFetcherData = { result: { id: string } } | { error: Error };
