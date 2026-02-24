import { type HttpApiResponse } from '@/lib/api';
import { InvalidResponseException } from '@/lib/exception';
import { renalTrackerApi } from '@/services/api';
import { AuthService } from '@/services/auth-service';
import type { LoginForm } from './types';

const authService = new AuthService();

export async function submitLogin(
  data: LoginForm,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { accessToken, refreshToken } = await performEmailAuthorization(data);

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens received');
  }

  return { accessToken, refreshToken };
}

async function performEmailAuthorization(
  data: LoginForm,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const { accessToken, refreshToken } = await authService.authorize(
    data,
    setAuthHeader,
  );

  if (!accessToken) {
    throw new InvalidResponseException('No access token in auth response');
  }

  return { accessToken, refreshToken };
}

function setAuthHeader(
  response: HttpApiResponse<{ accessToken?: string }>,
): void {
  const accessToken = response.data.accessToken;
  renalTrackerApi.axiosInstance.defaults.headers.common.Authorization =
    accessToken ? `Bearer ${accessToken}` : null;
}
