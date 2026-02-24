export type ErrorResponse = {
  message?: string;
};

type PkgSex = 'male' | 'female';

interface CheckEmailPkgCheckEmailV0Request {
  email?: string;
}

interface CheckEmailPkgCheckEmailV0Response {
  isExists?: boolean;
}

interface RegistrationPkgRegistrationV0Request {
  dateBirth?: string;
  email?: string;
  height?: number;
  name?: string;
  password?: string;
  patronymic?: string;
  sex?: PkgSex;
  surname?: string;
  weight?: number;
}

interface RegistrationPkgRegistrationV0Response {
  id?: string;
}

interface GetUserInfoV0Response {
  id?: string;
  dateBirth?: string;
  email?: string;
  height?: number;
  name?: string;
  patronymic?: string;
  sex?: PkgSex;
  surname?: string;
  weight?: number;
}

export interface UpdateInfoPkgUpdateUserInfoV0Request {
  dateBirth?: string;
  height?: number;
  name?: string;
  patronymic?: string;
  sex?: PkgSex;
  surname?: string;
  weight?: number;
}

export interface UpdateInfoPkgUpdateUserInfoV0Response {
  dateBirth?: string;
  email?: string;
  height?: number;
  name?: string;
  patronymic?: string;
  sex?: PkgSex;
  surname?: string;
  weight?: number;
}

export type RegisterRequestData = RegistrationPkgRegistrationV0Request;
export type RegisterResponseData = RegistrationPkgRegistrationV0Response;

export type GetUserProfileResponseData = GetUserInfoV0Response;

export type UpdateUserProfileRequestData = UpdateInfoPkgUpdateUserInfoV0Request;
export type UpdateUserProfileResponseData =
  UpdateInfoPkgUpdateUserInfoV0Response;

export type CheckEmailRequestData = CheckEmailPkgCheckEmailV0Request;
export type CheckEmailResponseData = CheckEmailPkgCheckEmailV0Response;
