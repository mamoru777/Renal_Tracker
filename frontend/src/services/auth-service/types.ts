interface AuthPkgAuthV0Request {
  email?: string;
  password?: string;
}

interface AuthPkgAuthV0Response {
  accessToken?: string;
  refreshToken?: string;
}

interface ChangePasswordPkgChangePasswordV0Request {
  newPassword?: string;
  oldPassword?: string;
}

type ChangePasswordPkgChangePasswordV0Response = object;

export type ErrorResponse = {
  message?: string;
};

export type AuthorizeRequestData = AuthPkgAuthV0Request;
export type AuthorizeResponseData = AuthPkgAuthV0Response;

export type ChangePasswordRequestData =
  ChangePasswordPkgChangePasswordV0Request;
export type ChangePasswordResponseData =
  ChangePasswordPkgChangePasswordV0Response;
