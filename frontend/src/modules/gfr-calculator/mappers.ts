import type { GfrCalcParams } from '@/models/gfr-params';
import type { AuthCalcForm, UnauthCalcForm } from './types';

export function mapCalcUnauthFormToGfrParams(
  form: UnauthCalcForm,
): GfrCalcParams {
  return form;
}

export function mapCalcAuthFormToGfrParams(form: AuthCalcForm): GfrCalcParams {
  const { creatinineTestDate, ...restForm } = form;
  const testDateValue = creatinineTestDate ?? new Date();
  return {
    ...restForm,
    creatinineTestDate: new Date(
      Date.UTC(
        testDateValue.getFullYear(),
        testDateValue.getMonth(),
        testDateValue.getDate(),
        0,
        0,
        0,
        0,
      ),
    ).toISOString(),
  };
}
