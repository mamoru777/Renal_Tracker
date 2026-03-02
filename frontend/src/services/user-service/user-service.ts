import { type HttpApi } from '@/lib/api';
import type { AuthorizedUser, User } from '@/models';
import { renalTrackerApi } from '../api';
import { type AuthService, renalTrackerAuthService } from '../auth-service';
import {
  mapUserProfileResponseToUser,
  mapUserToCreateUserRequest,
  mapUserToUpdateUserRequest,
} from './mappers';
import type {
  RegisterRequestData,
  RegisterResponseData,
  UpdateUserProfileRequestData,
  UpdateUserProfileResponseData,
} from './types';

export class UserService {
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

  public async register({
    data,
    signal,
  }: ServiceRequest<
    Omit<User, 'id'>,
    RegisterResponseData
  >): Promise<RegisterResponseData> {
    const response = await this.api.post<
      RegisterRequestData,
      RegisterResponseData
    >({
      url: '/user/reg',
      data: mapUserToCreateUserRequest(data),
      signal,
    });

    return response.data;
  }

  public async getAuthenticatedUserInfo({
    signal,
  }: ServiceRequest<undefined, AuthorizedUser>): Promise<AuthorizedUser> {
    const response = await this.api.get<
      RegisterRequestData,
      RegisterResponseData
    >({
      url: '/user/me',
      headers: this.headers,
      signal,
    });
    return mapUserProfileResponseToUser(response.data);
  }

  public async updateAuthenticatedUserInfo({
    data,
    signal,
  }: ServiceRequest<AuthorizedUser, AuthorizedUser>): Promise<AuthorizedUser> {
    const response = await this.api.post<
      UpdateUserProfileRequestData,
      UpdateUserProfileResponseData
    >({
      url: '/user/updateInfo',
      data: mapUserToUpdateUserRequest(data),
      headers: this.headers,
      signal,
    });

    return mapUserProfileResponseToUser(response.data);
  }
}
