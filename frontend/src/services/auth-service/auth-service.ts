import { type HttpApi, type HttpApiResponse } from '@/lib/api';
import { renalTrackerApi } from '../api';
import type {
  AuthorizeRequestData,
  AuthorizeResponseData,
  ChangePasswordRequestData,
  ChangePasswordResponseData,
} from './types';

export class AuthService {
  private _api: HttpApi = renalTrackerApi;

  private get api() {
    return this._api;
  }

  constructor() {}

  public async authorize(
    rqData: AuthorizeRequestData,
    handleResponse?: (res: HttpApiResponse<AuthorizeResponseData>) => void,
  ): Promise<AuthorizeResponseData> {
    const response = await this.api.post<
      AuthorizeRequestData,
      AuthorizeResponseData
    >({
      url: '/user/auth',
      data: rqData,
    });

    handleResponse?.(response);

    return response.data;
  }

  public async changePassword(
    rqData: ChangePasswordRequestData,
    handleResponse?: (res: HttpApiResponse<AuthorizeResponseData>) => void,
  ): Promise<AuthorizeResponseData> {
    const response = await this.api.post<
      ChangePasswordRequestData,
      ChangePasswordResponseData
    >({
      url: '/user/changePassword',
      data: rqData,
    });

    handleResponse?.(response);

    return response.data;
  }
}
