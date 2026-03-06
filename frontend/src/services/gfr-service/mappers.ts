import {
  InvalidRequestException,
  InvalidResponseException,
} from '@/lib/exception';
import type { GfrCalcParams } from '@/models/gfr-params';
import type {
  CalcAuthGfrRequestData,
  CalcAuthGfrResponseData,
  CalcUnauthGfrRequestData,
  CalcUnauthGfrResponseData,
  GetGfrResponseData,
  SaveGfrRequestData,
} from './types';

export function mapGfrParamsModelToCalcRequest(
  gfrParams: GfrCalcParams,
): CalcAuthGfrRequestData {
  const {
    creatinine,
    creatinineCurrency,
    age,
    bsa,
    creatinineTestDate,
    height,
    isAbsolute,
    sex,
    weight,
  } = gfrParams;

  return {
    creatinine,
    creatinineCurrency,
    isAbsolute: Boolean(isAbsolute),
    age,
    bsa,
    creatinineTestDate,
    height,
    sex,
    weight,
  };
}

export function mapGfrParamsModelToCalcPublicRequest(
  gfrParams: GfrCalcParams,
): CalcUnauthGfrRequestData {
  const {
    creatinine,
    creatinineCurrency,
    age,
    bsa,
    height,
    isAbsolute,
    sex,
    weight,
  } = gfrParams;

  if (typeof age !== 'number') {
    throw new InvalidRequestException(
      `Expected age to be number, but received: ${typeof age}`,
    );
  }

  if (!sex) {
    throw new InvalidRequestException(
      `Expected sex to be enum type, but received: ${typeof sex} ${sex}`,
    );
  }

  return {
    creatinine,
    creatinineCurrency,
    isAbsolute: Boolean(isAbsolute),
    age,
    bsa,
    height,
    sex,
    weight,
  };
}

export function mapCalcPublicResponseToGfrParamsModel(
  response: CalcUnauthGfrResponseData,
): GfrCalcParams {
  const {
    age,
    bsa,
    creatinine,
    creatinineCurrency,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
    isAbsolute,
    sex,
    height,
    weight,
  } = response;

  return {
    creatinine,
    creatinineCurrency,
    age,
    bsa,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
    height,
    isAbsolute,
    sex,
    weight,
  };
}

export function mapCalcResponseToGfrParamsModel(
  response: CalcAuthGfrResponseData,
): GfrCalcParams {
  const {
    age,
    bsa,
    creatinine,
    creatinineCurrency,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
    isAbsolute,
    sex,
    height,
    weight,
    creatinineTestDate,
  } = response;

  return {
    creatinine,
    creatinineCurrency,
    age,
    bsa,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
    height,
    isAbsolute,
    sex,
    weight,
    creatinineTestDate,
  };
}

export function mapGfrParamsModelToSaveGfrRequest(
  gfrParams: GfrCalcParams,
): SaveGfrRequestData {
  const {
    creatinine,
    creatinineCurrency,
    age,
    bsa,
    creatinineTestDate,
    height,
    isAbsolute,
    sex,
    weight,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
  } = gfrParams;

  if (!creatinineTestDate) {
    throw new InvalidRequestException(
      `Expected creatinineTestDate to be date, but received: ${typeof creatinineTestDate} ${creatinineTestDate}`,
    );
  }

  if (typeof gfr !== 'number') {
    throw new InvalidRequestException(
      `Expected gfr to be number, but received: ${typeof gfr} ${gfr}`,
    );
  }

  return {
    creatinine,
    creatinineCurrency,
    isAbsolute: Boolean(isAbsolute),
    age,
    bsa,
    creatinineTestDate,
    height,
    sex,
    weight,
    gfr,
    gfrCurrency,
    gfrMediumEnd,
    gfrMediumStart,
    gfrMinimum,
  };
}

export function mapGfrResultsResponseToGfrParamsModelList(
  response: GetGfrResponseData,
): GfrCalcParams[] {
  if (!Array.isArray(response.results)) {
    throw new InvalidResponseException('Expected results to be an array');
  }

  return response.results.map(
    ({
      age,
      bsa,
      creatinine,
      creatinineCurrency,
      gfr,
      gfrCurrency,
      gfrMediumEnd,
      gfrMediumStart,
      gfrMinimum,
      isAbsolute,
      sex,
      height,
      weight,
      creatinineTestDate,
    }) => ({
      creatinine,
      creatinineCurrency,
      age,
      bsa,
      gfr,
      gfrCurrency,
      gfrMediumEnd,
      gfrMediumStart,
      gfrMinimum,
      height,
      isAbsolute,
      sex,
      weight,
      creatinineTestDate,
    }),
  );
}
