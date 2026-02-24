import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Link } from '@/components/link';
import { appRoutes } from '@/constants/routes';
import { defaultLogger } from '@/lib/logger';
import { toastProvider } from '@/modules/toast';
import { useSetTokens } from '../auth-provider';
import { submitLogin } from './actions';
import type { LoginForm } from './types';
import styles from './auth-form.module.css';

export function AuthForm() {
  const setTokens = useSetTokens();
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<LoginForm>({
    defaultValues: {
      email: history.state.usr?.email ?? '',
      password: '',
    },
  });

  const handleAuth = useCallback(
    async (formData: LoginForm) => {
      try {
        const { accessToken, refreshToken } = await submitLogin(formData);
        setTokens(accessToken, refreshToken);

        const redirectUri = new URLSearchParams(window.location.search).get(
          'redirect_uri',
        );

        navigate(redirectUri ? decodeURIComponent(redirectUri) : appRoutes.ME, {
          replace: true,
          state: { email: null },
        });
      } catch (e: unknown) {
        defaultLogger.error(e instanceof Error ? e?.message : 'Unknown error');
        toastProvider.error({ text: 'Ошибка при попытке авторизоваться' });
      }
    },
    [setTokens, navigate],
  );

  return (
    <form onSubmit={handleSubmit(handleAuth)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input.Text
            {...field}
            label="E-mail"
            errorText={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            fluid
          />
        )}
        rules={{
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Неверный формат электронной почты',
          },
        }}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Input.Password
            {...field}
            label="Пароль"
            errorText={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            fluid
          />
        )}
        rules={{ required: true }}
      />
      <div className={styles.buttons}>
        <Button htmlType="submit">Войти</Button>
        <Link href={appRoutes.JOIN} type="secondary">
          Регистрация
        </Link>
      </div>
    </form>
  );
}
