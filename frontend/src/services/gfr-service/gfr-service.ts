import { type HttpApi } from '@/lib/api';
import type { GfrCalcParams } from '@/models/gfr-params';
import { renalTrackerApi } from '../api';
import { type AuthService, renalTrackerAuthService } from '../auth-service';
import {
  mapCalcPublicResponseToGfrParamsModel,
  mapCalcResponseToGfrParamsModel,
  mapGfrParamsModelToCalcPublicRequest,
  mapGfrParamsModelToCalcRequest,
  mapGfrParamsModelToSaveGfrRequest,
  mapGfrResultsResponseToGfrParamsModelList,
} from './mappers';
import type {
  CalcAuthGfrRequestData,
  CalcAuthGfrResponseData,
  CalcUnauthGfrRequestData,
  CalcUnauthGfrResponseData,
  GetGfrRequestData,
  GetGfrResponseData,
  SaveGfrRequestData,
  SaveGfrResponseData,
} from './types';

export class GfrService {
  private _api: HttpApi = renalTrackerApi;
  private authService: AuthService = renalTrackerAuthService;

  private get api() {
    return this._api;
  }

  private get headers(): Record<string, string> {
    return this.authService.tokens
      ? { Authorization: `Bearer ${this.authService.tokens.accessToken}` }
      : {};
  }

  constructor() {}

  public async calcUnauthorizedGfr({
    data,
    signal,
  }: ServiceRequest<GfrCalcParams, GfrCalcParams>): Promise<GfrCalcParams> {
    const response = await this.api.post<
      CalcUnauthGfrRequestData,
      CalcUnauthGfrResponseData
    >({
      url: '/gfr/calcPublic',
      data: mapGfrParamsModelToCalcPublicRequest(data),
      signal,
    });

    return mapCalcPublicResponseToGfrParamsModel(response.data);
  }

  public async calcAuthorizedGfr({
    data,
    signal,
  }: ServiceRequest<GfrCalcParams, GfrCalcParams>): Promise<GfrCalcParams> {
    const response = await this.api.post<
      CalcAuthGfrRequestData,
      CalcAuthGfrResponseData
    >({
      url: '/gfr/calc',
      data: mapGfrParamsModelToCalcRequest(data),
      signal,
      headers: this.headers,
    });

    return mapCalcResponseToGfrParamsModel(response.data);
  }

  public async saveGfrResult({
    data,
    signal,
  }: ServiceRequest<
    GfrCalcParams,
    SaveGfrResponseData
  >): Promise<SaveGfrResponseData> {
    const response = await this.api.post<
      SaveGfrRequestData,
      SaveGfrResponseData
    >({
      url: '/gfr/saveResult',
      data: mapGfrParamsModelToSaveGfrRequest(data),
      signal,
      headers: this.headers,
    });

    return response.data;
  }

  public async getGfrResult({
    data,
    signal,
  }: ServiceRequest<GetGfrRequestData, GetGfrResponseData>): Promise<
    GfrCalcParams[]
  > {
    const response = await this.api.get<GetGfrRequestData, GetGfrResponseData>({
      url: '/gfr/getResults',
      data,
      signal,
      headers: this.headers,
    });

    return mapGfrResultsResponseToGfrParamsModelList(response.data);
  }
}
