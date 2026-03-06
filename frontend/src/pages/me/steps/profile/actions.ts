import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, data } from 'react-router';
import { globalSpinnerProvider } from '@/modules/global-spinner';
import { createEagerLoadAuthenticatedUserData, saveUser } from '@/modules/user';
import { resolvePageLoaderError } from '@/utils/helpers';

export function createLoadProfilePageData(
  queryClient: QueryClient,
): () => void {
  return createEagerLoadAuthenticatedUserData(queryClient);
}

export function createEditProfileAction(
  queryClient: QueryClient,
): ActionFunction {
  return async function editProfileAction({ request }) {
    const stopSpinner = globalSpinnerProvider.startSpinner(
      Date.now().toString(),
    );

    try {
      const body = await request.json();
      const newUser = await saveUser(queryClient, body);
      return data({ user: newUser }, { status: 200 });
    } catch (e: unknown) {
      return resolvePageLoaderError(e);
    } finally {
      stopSpinner();
    }
  };
}
