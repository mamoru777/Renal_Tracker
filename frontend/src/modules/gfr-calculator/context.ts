import { type FetcherWithComponents, useFetcher } from 'react-router';
import { useUserId } from '@/modules/auth';
import { AUTH_FETCHER_KEY, UNAUTH_FETCHER_KEY } from './constants';
import type { GfrFetcherData } from './types';

export function useGfrFetcher(): FetcherWithComponents<GfrFetcherData> {
  const userId = useUserId();
  const key = userId ? AUTH_FETCHER_KEY : UNAUTH_FETCHER_KEY;
  return useFetcher<GfrFetcherData>({ key });
}
