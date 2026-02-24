import { useCallback, useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PageSection } from '@/components/page-section';
import { defaultLogger } from '@/lib/logger';
import { ChangePassword } from '@/modules/auth';
import { toastProvider } from '@/modules/toast';
import { useAuthenticatedUser } from '@/modules/user';
import type { createPageActions } from './actions';
import { USER_EDIT_FORM } from './constants';
import { mapFormToUser, mapUserToForm } from './mappers';
import type { UserForm } from './types';
import styles from './me.module.css';

export function Me() {
  const { user } = useAuthenticatedUser();
  const fetcher =
    useFetcher<Awaited<ReturnType<ReturnType<typeof createPageActions>>>>();
  const formId = useId();
  const { data, state } = fetcher;

  useEffect(() => {
    if (!data || state !== 'idle') {
      return;
    }

    if ('error' in data && data.error instanceof Error) {
      const message = 'Ошибка при обновлении данных пользователя';
      defaultLogger.error(message, ': ', data.error?.message);
      toastProvider.error({
        text: message,
      });
      return;
    }

    if ('user' in data) {
      toastProvider.success({
        text: 'Данные успешно обновлены',
      });
    }
  }, [data, state]);

  const { handleSubmit, control, reset, register } = useForm<UserForm>({
    defaultValues: mapUserToForm(user),
    context: { userId: user.id },
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  const handleReset = useCallback(() => {
    reset();
    setIsEdit(false);
  }, [setIsEdit, reset]);

  const handleEditUser = useCallback(
    (formData: UserForm) => {
      setIsEdit(false);
      fetcher.submit(
        JSON.stringify({
          ...mapFormToUser(formData),
          _actionType: USER_EDIT_FORM,
        }),
        {
          method: 'post',
          encType: 'application/json',
        },
      );
    },
    [setIsEdit, fetcher],
  );

  return (
    <PageSection>
      <h1>Данные пользователя</h1>
      <form onSubmit={handleSubmit(handleEditUser)} id={formId}>
        <input type="hidden" {...register('id')} value={user.id} />
        <Controller
          name="email"
          control={control}
          disabled
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
              value: new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$', 'i'),
              message: 'Неверно введен Email',
            },
          }}
        />
        <Controller
          name="surname"
          control={control}
          disabled={!isEdit}
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
          disabled={!isEdit}
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
          disabled={!isEdit}
          render={({ field, fieldState }) => (
            <Input.Text
              {...field}
              label="Отчество"
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
          name="birthdate"
          control={control}
          disabled={!isEdit}
          render={({ field, fieldState }) => (
            <Input.Date
              {...field}
              label="День рождения"
              errorText={fieldState.error?.message}
              fluid
              isInvalid={fieldState.invalid}
            />
          )}
          rules={{
            required: true,
          }}
        />
        <Controller
          name="sex"
          control={control}
          disabled={!isEdit}
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
        <Controller
          name="height"
          control={control}
          disabled={!isEdit}
          render={({ field, fieldState }) => (
            <Input.Number
              {...field}
              label="Рост"
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              suffix=" см"
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          disabled={!isEdit}
          render={({ field, fieldState }) => (
            <Input.Number
              {...field}
              label="Вес"
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              suffix=" кг"
            />
          )}
        />
      </form>
      <div className={styles.buttonGroup}>
        {!isEdit && (
          <>
            <Button
              onClick={handleEditClick}
              icon="pi pi-user-edit"
              type="secondary"
            >
              Редактировать данные
            </Button>
            <ChangePassword />
          </>
        )}
        {isEdit && (
          <>
            <Button formId={formId} onClick={handleReset} type="danger">
              Отмена
            </Button>
            <Button formId={formId} htmlType="submit">
              Сохранить
            </Button>
          </>
        )}
      </div>
    </PageSection>
  );
}
