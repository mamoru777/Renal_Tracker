import { type ActionFunction, data } from 'react-router';
import type { GfrCalcParams } from '@/models/gfr-params';
import { GfrService } from '@/services/gfr-service';
import { resolvePageLoaderError } from '@/utils/helpers';

const gfrService = new GfrService();

export function createCalcGfrUnauthorized(): ActionFunction {
  return async function calcUnauthorized({ request }) {
    try {
      const gfrParams = await request.json();
      const gfrCalcResult = await performGfrCalculationUnauth(gfrParams);
      return data({ calcResult: gfrCalcResult }, { status: 200 });
    } catch (e: unknown) {
      return resolvePageLoaderError(e);
    }
  };
}

export function createCalcGfrAuthorized(): ActionFunction {
  return async function calcUnauthorized({ request }) {
    try {
      const gfrParams = await request.json();
      const gfrCalcResult = await performGfrCalculationAuth(gfrParams);
      return data({ calcResult: gfrCalcResult }, { status: 200 });
    } catch (e: unknown) {
      return resolvePageLoaderError(e);
    }
  };
}

export function createSaveGfrResult(): ActionFunction {
  return async function saveGfrResult({ request }) {
    try {
      const gfrParams = await request.json();
      const result = await performGfrSave(gfrParams);
      return data({ result }, { status: 200 });
    } catch (e: unknown) {
      return resolvePageLoaderError(e);
    }
  };
}

async function performGfrCalculationUnauth(gfrParams: GfrCalcParams) {
  return gfrService.calcUnauthorizedGfr({ data: gfrParams });
}

async function performGfrCalculationAuth(gfrParams: GfrCalcParams) {
  return gfrService.calcAuthorizedGfr({ data: gfrParams });
}

async function performGfrSave(gfrParams: GfrCalcParams) {
  return gfrService.saveGfrResult({ data: gfrParams });
}
