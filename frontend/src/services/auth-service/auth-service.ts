import {
  type HttpApi,
  type HttpApiRequest,
  type HttpApiResponse,
} from '@/lib/api';
import {
  InvalidCredentialsException,
  type ServerException,
} from '@/lib/exception';
import { renalTrackerApi } from '../api';
import type {
  AuthorizeRequestData,
  AuthorizeResponseData,
  ChangePasswordRequestData,
  ChangePasswordResponseData,
  RefreshTokensData,
} from './types';

export class AuthService {
  private _api: HttpApi | null = null;
  /** Consider null as unitialized, otherwise tokens were once initialized */
  private _tokens: Partial<Tokens> | null = null;
  private _refreshInProgress: Promise<
    HttpApiResponse<RefreshTokensData>
  > | null = null;

  private get api(): HttpApi {
    if (!this._api) {
      throw new Error('Api has not been initialized yet');
    }

    return this._api;
  }

  constructor(api: HttpApi) {
    this._api = api;
    this._api.onError(this.handleApiError.bind(this));
  }

  public async authorize({
    data,
    onSuccess,
    signal,
  }: ServiceRequest<
    AuthorizeRequestData,
    AuthorizeResponseData
  >): Promise<AuthorizeResponseData> {
    const response = await this.api.post<
      AuthorizeRequestData,
      AuthorizeResponseData
    >({
      url: '/user/auth',
      data,
      signal,
    });

    onSuccess?.(response);

    this._tokens = response.data;
    return response.data;
  }

  public async changePassword({
    data,
    onSuccess,
    signal,
  }: ServiceRequest<
    ChangePasswordRequestData,
    AuthorizeResponseData
  >): Promise<AuthorizeResponseData> {
    const response = await this.api.post<
      ChangePasswordRequestData,
      ChangePasswordResponseData
    >({
      url: '/user/changePassword',
      data,
      signal,
    });

    onSuccess?.(response);
    return response.data;
  }

  public async refreshTokens({
    onSuccess,
    signal,
  }: ServiceRequest<undefined, RefreshTokensData>): Promise<RefreshTokensData> {
    if (!this._refreshInProgress) {
      this._refreshInProgress = this.api.post<null, RefreshTokensData>({
        url: '/tokens/refresh',
        signal,
      });
    }

    try {
      const response = await this._refreshInProgress;

      onSuccess?.(response);
      this._tokens = response.data;
      return response.data;
    } catch (e: unknown) {
      if (e instanceof InvalidCredentialsException) {
        const tokens = { accessToken: undefined, refreshToken: undefined };
        this._tokens = tokens;
        return tokens;
      }

      throw e;
    } finally {
      this._refreshInProgress = null;
    }
  }

  /** Consider null as unitialized, otherwise tokens were once initialized */
  public get tokens(): Partial<Tokens> | null {
    return this._tokens;
  }

  public logout() {
    this._tokens = { accessToken: undefined, refreshToken: undefined };
  }

  private async handleApiError<T>(e: ServerException, req: HttpApiRequest<T>) {
    if (req.url === '/tokens/refresh') {
      throw e;
    }

    if (e instanceof InvalidCredentialsException && req.method) {
      const { accessToken } = await this.refreshTokens({});
      if (accessToken) {
        return await this.api[req.method]({
          ...req,
          headers: {
            ...req.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    }

    throw e;
  }
}

export const renalTrackerAuthService = new AuthService(renalTrackerApi);
