import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { QK_CURRENT_USER, QK_USER } from '@/constants/query-keys';
import { useUserId } from '../auth';
import { fetchAuthUserInfo } from './actions';

export function useAuthenticatedUser() {
  const { data: user } = useSuspenseQuery({
    queryKey: [QK_USER, QK_CURRENT_USER],
    queryFn: fetchAuthUserInfo,
  });

  return { user };
}

export function useOptionalAuthenticatedUser() {
  const userId = useUserId();

  const { data: user } = useQuery({
    queryKey: [QK_USER, QK_CURRENT_USER],
    queryFn: fetchAuthUserInfo,
    enabled: Boolean(userId),
  });

  return { user };
}
