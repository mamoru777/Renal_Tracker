import type { QueryClient } from '@tanstack/react-query';
import { type ActionFunction, data } from 'react-router';
import type { AuthorizedUser } from '@/models';
import { globalSpinnerProvider } from '@/modules/global-spinner';
import { createEagerLoadAuthenticatedUserData, saveUser } from '@/modules/user';
import { resolvePageLoaderError } from '@/utils/helpers';
import { USER_EDIT_FORM } from './constants';

export function createLoadPageData(queryClient: QueryClient): () => void {
  return createEagerLoadAuthenticatedUserData(queryClient);
}

export function createPageActions(queryClient: QueryClient) {
  return async function mePageActionsResolver(
    ...[{ request }]: Parameters<ActionFunction>
  ): Promise<ReturnType<typeof submitUserEdit>> {
    const body = await request.json();
    if (isUserEditForm(body)) {
      return await submitUserEdit(queryClient, body);
    }

    throw new Error('Unknown fetcher action');
  };
}

function isUserEditForm(
  body: unknown,
): body is Parameters<typeof submitUserEdit>[1] {
  return Boolean(
    body &&
    typeof body === 'object' &&
    '_actionType' in body &&
    body._actionType === USER_EDIT_FORM,
  );
}

async function submitUserEdit(queryClient: QueryClient, user: AuthorizedUser) {
  const stopSpinner = globalSpinnerProvider.startSpinner(Date.now().toString());
  try {
    const newUser = await saveUser(queryClient, user);
    return data({ user: newUser }, { status: 200 });
  } catch (e: unknown) {
    return resolvePageLoaderError(e);
  } finally {
    stopSpinner();
  }
}
