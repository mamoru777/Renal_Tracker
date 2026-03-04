import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useActionData, useSubmit } from 'react-router';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Link } from '@/components/link';
import { appRoutes } from '@/constants/routes';
import { InvalidCredentialsException } from '@/lib/exception';
import { toastProvider } from '@/modules/toast';
import type { LoginForm } from './types';
import styles from './auth-form.module.css';

export function AuthForm() {
  const submit = useSubmit();
  const actionData = useActionData();

  const { handleSubmit, control } = useForm<LoginForm>({
    defaultValues: {
      email: history.state.usr?.email ?? '',
      password: '',
    },
  });

  useEffect(() => {
    if (actionData?.error) {
      const text =
        actionData.error instanceof InvalidCredentialsException
          ? 'Неверный логин или пароль'
          : 'Ошибка при попытке авторизоваться';

      toastProvider.error({ text });
    }
  }, [actionData]);

  const handleAuth = useCallback(
    async (formData: LoginForm) => {
      await submit(JSON.stringify(formData), {
        method: 'post',
        encType: 'application/json',
      });
    },
    [submit],
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
