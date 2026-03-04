import {
  type DataStrategyResult,
  type MiddlewareFunction,
  redirect,
} from 'react-router';
import { appRoutes } from '@/constants/routes';
import { userCtx } from '../auth-provider';

export const authMiddleware: MiddlewareFunction = async (
  { context, request },
  next,
) => {
  if (!context.get(userCtx).userId) {
    return redirectToAuth(request.url);
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
    return redirectToAuth(request.url);
  }

  return response;
};

function redirectToAuth(url: string): never {
  const urlObject = new URL(url);
  const search = new URLSearchParams('?');
  search.set(
    'redirect_uri',
    encodeURIComponent(urlObject.pathname + urlObject.search),
  );

  throw redirect(`${appRoutes.AUTH}?${search.toString()}`);
}
