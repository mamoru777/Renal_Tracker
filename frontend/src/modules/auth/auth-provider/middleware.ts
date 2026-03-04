import type { QueryClient } from '@tanstack/react-query';
import { type DataStrategyResult, type MiddlewareFunction } from 'react-router';
import { QK_TOKEN } from '@/constants/query-keys';
import { getTokenExpirationTime, getUserIdFromToken } from '@/utils/helpers';
import { userCtx } from '../auth-provider';
import { refreshTokens } from './actions';

export function createTokensMiddleware(
  queryClient: QueryClient,
): MiddlewareFunction {
  return async ({ context }, next) => {
    const tokens = await queryClient.ensureQueryData({
      queryKey: [QK_TOKEN],
      queryFn: refreshTokens,
      staleTime: (query) => {
        const currentTokens = query.state.data;
        if (currentTokens?.accessToken) {
          return (
            getTokenExpirationTime(currentTokens.accessToken).valueOf() -
            Date.now() -
            120 * 1000
          );
        }

        return 120 * 1000;
      },
    });

    if (tokens?.accessToken) {
      context.set(userCtx, {
        initialized: true,
        userId: getUserIdFromToken(tokens.accessToken),
      });
    } else {
      context.set(userCtx, { initialized: true, userId: undefined });
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
      context.set(userCtx, { initialized: true, userId: undefined });
    }

    return response;
  };
}
