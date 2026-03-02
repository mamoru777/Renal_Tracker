import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { QK_TOKEN } from '@/constants/query-keys';
import { InvalidCredentialsException } from '@/lib/exception';
import { getTokenExpirationTime } from '@/utils/helpers';
import { refreshTokens } from './actions';

export function AuthProvider() {
  useQuery({
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

      if (
        query.state.status === 'error' &&
        query.state.error instanceof InvalidCredentialsException
      ) {
        return false;
      }

      return query.state.fetchFailureCount > 2 ? false : 30 * 1000;
    },
    refetchIntervalInBackground: true,
    retry: false,
  });

  return <Outlet />;
}
