import { useStore } from 'zustand';
import { getUserIdFromToken } from '@/utils/helpers';
import { authStore } from './store';

export function useUserId() {
  const userId = useStore(authStore, ({ refreshToken }) =>
    getUserIdFromToken(refreshToken),
  );
  return userId;
}

export function useLogout() {
  const setTokens = useSetTokens();
  return () => setTokens(undefined, undefined);
}

export function useSetTokens() {
  return useStore(authStore, ({ setTokens }) => setTokens);
}
