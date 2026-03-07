import { useQuery } from '@tanstack/react-query';
import { createContext, useFetcher, useLocation } from 'react-router';
import { QK_TOKEN } from '@/constants/query-keys';
import { appRoutes } from '@/constants/routes';
import { getTokenExpirationTime, getUserIdFromToken } from '@/utils/helpers';
import { refreshTokens } from './actions';
import type { UserCtx } from './types';

export const userCtx = createContext<UserCtx>({
  userId: undefined,
  initialized: false,
});

export function useUserId() {
  const { accessToken } = useTokens();
  const userId = getUserIdFromToken(accessToken);
  return userId;
}

export function useTokens(): Partial<Tokens> {
  const { data } = useQuery({
    queryKey: [QK_TOKEN],
    queryFn: refreshTokens,
    refetchInterval: (query) => {
      const currentTokens = query.state.data;
      if (currentTokens?.accessToken) {
        return (
          getTokenExpirationTime(currentTokens.accessToken).valueOf() -
          Date.now() -
          120 * 1000
        );
      }

      if (query.state.status === 'success' && !currentTokens?.accessToken) {
        return false;
      }

      return query.state.fetchFailureCount > 2 ? false : 30 * 1000;
    },
    refetchIntervalInBackground: true,
    retry: false,
  });

  return { ...data };
}

export function useLogout() {
  const { pathname, search } = useLocation();
  const fetcher = useFetcher();
  return async () => {
    const searchParams = new URLSearchParams({
      redirect_uri: encodeURIComponent(pathname + search),
    });
    await fetcher.submit(null, {
      action: `${appRoutes.LOGOUT}?${searchParams}`,
      method: 'post',
    });
  };
}
