import {
  type DataStrategyResult,
  type MiddlewareFunction,
  redirect,
} from 'react-router';
import { appRoutes } from '@/constants/routes';
import { CookieStorage } from '@/lib/storage';
import { renalTrackerApi } from '@/services/api';
import { isTokenStale } from '@/utils/helpers';

function redirectToAuth() {
  const search = new URLSearchParams('?');
  search.set(
    'redirect_uri',
    encodeURIComponent(location.pathname + location.search),
  );

  throw redirect(`${appRoutes.AUTH}?${search.toString()}`);
}

export const authMiddleware: MiddlewareFunction = async (_, next) => {
  const accessToken = new CookieStorage().get('accessToken');
  const refreshToken = new CookieStorage().get('refreshToken');
  const resolvedToken =
    accessToken && refreshToken && !isTokenStale(refreshToken)
      ? accessToken
      : null;
  renalTrackerApi.axiosInstance.defaults.headers.common.Authorization =
    resolvedToken ? `Bearer ${resolvedToken}` : null;

  if (!resolvedToken) {
    redirectToAuth();
  }

  const response = await next();
  if (
    typeof response === 'object' &&
    Object.values<DataStrategyResult>({ ...response }).some(
      ({ result }) =>
        result &&
        typeof result === 'object' &&
        'init' in result &&
        result.init &&
        typeof result.init === 'object' &&
        'status' in result.init &&
        result?.init.status === 401,
    )
  ) {
    redirectToAuth();
  }

  return response;
};
