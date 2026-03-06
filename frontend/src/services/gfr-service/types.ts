export type ErrorResponse = {
  message?: string;
};

type PkgSex = 'male' | 'female';
type PkgCreatinineCurrency = 'mg/dl' | 'mkmol/l';

interface CalcPkgCalcV0Request {
  age?: number;
  bsa?: number;
  creatinine: number;
  creatinineCurrency: PkgCreatinineCurrency;
  creatinineTestDate?: string;
  height?: number;
  isAbsolute: boolean;
  sex?: PkgSex;
  weight?: number;
}

interface CalcPkgCalcV0Response {
  age: number;
  bsa: number;
  creatinine: number;
  creatinineCurrency: PkgCreatinineCurrency;
  creatinineTestDate: string;
  gfr: number;
  gfrCurrency: string;
  gfrMediumEnd?: number;
  gfrMediumStart?: number;
  gfrMinimum?: number;
  height?: number;
  isAbsolute: boolean;
  sex: PkgSex;
  weight?: number;
}

interface CalcPublicPkgCalcPublicV0Request {
  age: number;
  bsa?: number;
  creatinine: number;
  creatinineCurrency: PkgCreatinineCurrency;
  height?: number;
  isAbsolute: boolean;
  sex: PkgSex;
  weight?: number;
}

interface CalcPublicPkgCalcPublicV0Response {
  age: number;
  bsa: number;
  creatinine: number;
  creatinineCurrency: PkgCreatinineCurrency;
  gfr: number;
  gfrCurrency: string;
  gfrMediumEnd: number;
  gfrMediumStart: number;
  gfrMinimum: number;
  height?: number;
  isAbsolute: boolean;
  sex: PkgSex;
  weight?: number;
}

interface SaveResultPkgSaveResultV0Request {
  age?: number;
  bsa?: number;
  creatinine?: number;
  creatinineCurrency?: PkgCreatinineCurrency;
  creatinineTestDate: string;
  gfr: number;
  gfrCurrency?: string;
  gfrMediumEnd?: number;
  gfrMediumStart?: number;
  gfrMinimum?: number;
  height?: number;
  isAbsolute?: boolean;
  sex?: PkgSex;
  weight?: number;
}

interface SaveResultPkgSaveResultV0Response {
  id: string;
}

interface GetResultsV0Request {
  query?: {
    /** ID записей, если нужны конкретные, перечисляются в одном параметре через запятую слитно */
    ids?: string;
    /** Сколько максимум записей нужно */
    limit?: number;
    /** Смещение по записям */
    offset?: number;
  };
}

interface GetResultsV0Response {
  results?: {
    age: number;
    bsa: number;
    creatinine: number;
    creatinineCurrency: PkgCreatinineCurrency;
    creatinineTestDate: string;
    gfr: number;
    gfrCurrency: string;
    gfrMediumEnd?: number;
    gfrMediumStart?: number;
    gfrMinimum?: number;
    height?: number;
    isAbsolute: boolean;
    sex: PkgSex;
    weight?: number;
  }[];
}

export type CalcAuthGfrRequestData = CalcPkgCalcV0Request;
export type CalcAuthGfrResponseData = CalcPkgCalcV0Response;

export type CalcUnauthGfrRequestData = CalcPublicPkgCalcPublicV0Request;
export type CalcUnauthGfrResponseData = CalcPublicPkgCalcPublicV0Response;

export type SaveGfrRequestData = SaveResultPkgSaveResultV0Request;
export type SaveGfrResponseData = SaveResultPkgSaveResultV0Response;

export type GetGfrRequestData = GetResultsV0Request;
export type GetGfrResponseData = GetResultsV0Response;
