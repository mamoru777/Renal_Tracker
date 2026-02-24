import type { QueryClient } from '@tanstack/react-query';
import { QK_CURRENT_USER, QK_USER } from '@/constants/query-keys';
import { InvalidCredentialsException } from '@/lib/exception';
import { defaultLogger } from '@/lib/logger';
import { CookieStorage } from '@/lib/storage';
import type { User } from '@/models/user';
import { UserService } from '@/services/user-service';
import { resolvePageLoaderError } from '@/utils/helpers';

const userService = new UserService();

export async function fetchAuthUserInfo(): Promise<User> {
  try {
    if (!isAuthenticated()) {
      throw new InvalidCredentialsException(
        new Error('No access token in cookie storage'),
      );
    }

    const userProfileData = await userService.getAuthenticatedUserInfo();
    return userProfileData;
  } catch (e: unknown) {
    defaultLogger.error('Ошибка при загрузке данных пользователя');
    throw e;
  }
}

export function createEagerLoadAuthenticatedUserData(queryClient: QueryClient) {
  return async function loadAuthenticatedUserData(): Promise<void> {
    try {
      if (!isAuthenticated()) {
        throw new InvalidCredentialsException(
          new Error('No access token in cookie storage'),
        );
      }

      await queryClient.ensureQueryData({
        queryKey: [QK_USER, QK_CURRENT_USER],
        queryFn: fetchAuthUserInfo,
        revalidateIfStale: true,
      });
    } catch (e: unknown) {
      throw resolvePageLoaderError(e);
    }
  };
}

export async function saveUser(
  queryClient: QueryClient,
  user: User,
): Promise<User> {
  try {
    queryClient.cancelQueries({ queryKey: [QK_USER, QK_CURRENT_USER] });
    const newUser = await userService.updateAuthenticatedUserInfo(user);
    queryClient.setQueryData([QK_USER, QK_CURRENT_USER], newUser);
    return newUser;
  } catch (e: unknown) {
    defaultLogger.error('Ошибка при попытке редактирования пользователя');
    throw e;
  }
}

function isAuthenticated(): boolean {
  return Boolean(new CookieStorage().get('accessToken'));
}
