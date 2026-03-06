import type { QueryClient } from '@tanstack/react-query';
import { QK_CURRENT_USER, QK_GFR_RESULTS_LIST } from '@/constants/query-keys';
import { defaultLogger } from '@/lib/logger';
import type { GfrCalcParams } from '@/models/gfr-params';
import { GfrService } from '@/services/gfr-service';
import { resolvePageLoaderError } from '@/utils/helpers';

export function createLoadAuthenticatedUserGfrResultsData(
  queryClient: QueryClient,
) {
  return async function loadAuthenticatedUserData(): Promise<void> {
    try {
      await queryClient.ensureQueryData({
        queryKey: [QK_CURRENT_USER, QK_GFR_RESULTS_LIST],
        queryFn: fetchAuthUserGfrResults,
        staleTime: 20 * 60 * 1000,
      });
    } catch (e: unknown) {
      throw resolvePageLoaderError(e);
    }
  };
}

async function fetchAuthUserGfrResults({
  signal,
}: ActionCtx): Promise<GfrCalcParams[]> {
  try {
    const results = await new GfrService().getGfrResult({
      signal,
      data: {},
    });
    return results;
  } catch (e: unknown) {
    defaultLogger.error('Ошибка при загрузке данных пользователя');
    throw e;
  }
}
