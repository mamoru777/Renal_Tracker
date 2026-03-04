import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, replace } from 'react-router';
import { QK_TOKEN } from '@/constants/query-keys';
import { appRoutes } from '@/constants/routes';
import { InvalidResponseException } from '@/lib/exception';
import { defaultLogger } from '@/lib/logger';
import { renalTrackerAuthService } from '@/services/auth-service';
import { resolvePageLoaderError } from '@/utils/helpers';
import type { LoginForm } from './types';

export function createAuthAction(queryClient: QueryClient): ActionFunction {
  return async function authAction({ request }) {
    try {
      const { accessToken, refreshToken } = await submitLogin(
        await request.json(),
      );
      queryClient.setQueryData([QK_TOKEN], {
        accessToken,
        refreshToken,
      });
      const redirectUri = new URLSearchParams(window.location.search).get(
        'redirect_uri',
      );

      return replace(
        redirectUri ? decodeURIComponent(redirectUri) : appRoutes.ME,
      );
    } catch (e: unknown) {
      defaultLogger.error(e instanceof Error ? e?.message : 'Unknown error');
      return resolvePageLoaderError(e);
    }
  };
}

async function submitLogin(data: LoginForm): Promise<Tokens> {
  const { accessToken, refreshToken } = await performEmailAuthorization(data);

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens received');
  }

  return { accessToken, refreshToken };
}

async function performEmailAuthorization(data: LoginForm): Promise<Tokens> {
  const { accessToken, refreshToken } = await renalTrackerAuthService.authorize(
    { data },
  );

  if (!accessToken) {
    throw new InvalidResponseException('No access token in auth response');
  }

  if (!refreshToken) {
    throw new InvalidResponseException('No refresh token in auth response');
  }

  return { accessToken, refreshToken };
}
