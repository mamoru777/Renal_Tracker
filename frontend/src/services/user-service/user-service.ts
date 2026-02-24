import { type HttpApi } from '@/lib/api';
import type { User } from '@/models/user';
import { renalTrackerApi } from '../api';
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

  private get api() {
    return this._api;
  }

  constructor() {}

  public async register(user: Omit<User, 'id'>): Promise<RegisterResponseData> {
    const response = await this.api.post<
      RegisterRequestData,
      RegisterResponseData
    >({
      url: '/user/reg',
      data: mapUserToCreateUserRequest(user),
    });

    return response.data;
  }

  public async getAuthenticatedUserInfo(): Promise<User> {
    const response = await this.api.get<
      RegisterRequestData,
      RegisterResponseData
    >({
      url: '/user/me',
    });
    return mapUserProfileResponseToUser(response.data);
  }

  public async updateAuthenticatedUserInfo(user: User): Promise<User> {
    const response = await this.api.post<
      UpdateUserProfileRequestData,
      UpdateUserProfileResponseData
    >({
      url: '/user/updateInfo',
      data: mapUserToUpdateUserRequest(user),
    });

    return mapUserProfileResponseToUser(response.data);
  }
}
