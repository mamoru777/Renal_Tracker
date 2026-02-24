import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { PageSection } from '@/components/page-section';
import { appRoutes } from '@/constants/routes';
import { defaultLogger } from '@/lib/logger';
import { toastProvider } from '@/modules/toast';
import { validatePassword } from '@/utils/validators';
import { submitJoin } from './actions';
import type { JoinForm } from './types';
import styles from './join.module.css';

export function Join() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<JoinForm>({
    defaultValues: {
      email: '',
      password: '',
      password2: '',
      birthdate: undefined,
      name: '',
      surname: '',
      patronymic: '',
      sex: undefined,
    },
  });

  const handleJoin = useCallback(
    async (formData: JoinForm): Promise<void> => {
      try {
        await submitJoin(formData);
        navigate(appRoutes.AUTH, { state: { email: formData.email } });
      } catch (e: unknown) {
        defaultLogger.error(
          e instanceof Error ? e?.message : 'Unknown error',
          String(e),
        );
        toastProvider.error({ text: 'Ошибка при попытке авторизоваться' });
      }
    },
    [navigate],
  );

  return (
    <div className={styles.container}>
      <PageSection className={styles.section}>
        <Card title="Регистрация">
          <form onSubmit={handleSubmit(handleJoin)} className={styles.form}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Text
                  {...field}
                  label="Email"
                  errorText={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  fluid
                />
              )}
              rules={{
                required: true,
                pattern: {
                  value: new RegExp(
                    '^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$',
                    'i',
                  ),
                  message: 'Неверно введен Email',
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
                  showMeter
                  fluid
                />
              )}
              rules={{ required: 'Поле обязательно для заполнения' }}
            />
            <Controller
              name="password2"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Password
                  {...field}
                  label="Повторите пароль"
                  errorText={fieldState.error?.message}
                  fluid
                  isInvalid={fieldState.invalid}
                />
              )}
              rules={{
                required: 'Поле обязательно для заполнения',
                deps: ['password'],
                validate: validatePassword,
              }}
            />
            <Controller
              name="surname"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Text
                  {...field}
                  label="Фамилия"
                  fluid
                  errorText={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
              rules={{
                required: true,
              }}
            />
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Text
                  {...field}
                  label="Имя"
                  fluid
                  errorText={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
              rules={{
                required: true,
              }}
            />
            <Controller
              name="patronymic"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Text
                  {...field}
                  label="Отчество"
                  fluid
                  errorText={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              name="birthdate"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Date
                  {...field}
                  label="День рождения"
                  errorText={fieldState.error?.message}
                  fluid
                  isInvalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              name="sex"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Sex
                  {...field}
                  label="Пол"
                  errorText={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
              rules={{
                required: true,
              }}
            />
            <Button htmlType="submit" className={styles.submit}>
              Войти
            </Button>
          </form>
        </Card>
      </PageSection>
    </div>
  );
}
