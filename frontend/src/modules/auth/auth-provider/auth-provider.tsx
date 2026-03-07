import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { toastProvider } from '@/modules/toast';
import { useTokens } from './auth-context';

export function AuthProvider() {
  const data = useLoaderData<{ error?: Error } | undefined>();

  useTokens();

  useEffect(() => {
    if (data?.error) {
      toastProvider.error({
        text: 'Произошла ошибка при загрузке авторизованного пользователя',
      });
    }
  }, [data?.error]);

  return <Outlet />;
}
