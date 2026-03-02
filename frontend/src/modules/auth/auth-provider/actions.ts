import { type QueryClient } from '@tanstack/react-query';
import {
  type ActionFunction,
  type LoaderFunction,
  redirect,
} from 'react-router';
import { QK_CURRENT_USER, QK_TOKEN } from '@/constants/query-keys';
import { appRoutes } from '@/constants/routes';
import { renalTrackerAuthService } from '@/services/auth-service';
import type { UserCtx } from './types';

export function createAuthProviderLoader(
  queryClient: QueryClient,
): LoaderFunction<UserCtx> {
  return async function authProviderLoader() {
    await queryClient.ensureQueryData({
      queryKey: [QK_TOKEN],
      queryFn: refreshTokens,
    });
  };
}

export function createLogoutAction(queryClient: QueryClient): ActionFunction {
  return async function logoutAction({ request }) {
    queryClient.setQueryData([QK_TOKEN], {
      accessToken: undefined,
      refreshToken: undefined,
    });
    queryClient.setQueryData([QK_CURRENT_USER], {
      accessToken: undefined,
      refreshToken: undefined,
    });
    renalTrackerAuthService.logout();
    const redirectUri = new URLSearchParams(new URL(request.url).search).get(
      'redirect_uri',
    );
    return redirect(
      redirectUri ? decodeURIComponent(redirectUri) : appRoutes.HOME,
    );
  };
}

export async function refreshTokens({
  signal,
}: ActionCtx): Promise<Partial<Tokens> | null> {
  const { accessToken, refreshToken } =
    await renalTrackerAuthService.refreshTokens({ signal });

  return { accessToken, refreshToken };
}
