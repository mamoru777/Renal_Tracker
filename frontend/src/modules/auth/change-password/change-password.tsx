import { useCallback, useId, useState } from 'react';
import cn from 'classnames';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { defaultLogger } from '@/lib/logger';
import { toastProvider } from '@/modules/toast';
import { validatePassword } from '@/utils/validators';
import { submitChangePassword } from './actions';
import type { ChangePasswordForm } from './types';
import styles from './change-password.module.css';

type Props = {
  className?: string;
};

function FooterButtons({ formId }: { formId: string }) {
  return (
    <>
      <Button formId={formId} htmlType="reset" type="danger">
        Отмена
      </Button>
      <Button formId={formId} htmlType="submit">
        Сохранить
      </Button>
    </>
  );
}

export function ChangePassword({ className }: Props) {
  const [isActive, setIsActive] = useState(false);
  const formId = useId();

  const { handleSubmit, control } = useForm<ChangePasswordForm>({
    defaultValues: {
      oldPassword: '',
      password: '',
      password2: '',
    },
  });

  const handlePasswordChange = useCallback(
    async (formData: ChangePasswordForm) => {
      try {
        await submitChangePassword(formData);
        setIsActive(false);
      } catch (e: unknown) {
        defaultLogger.error(e instanceof Error ? e?.message : 'Unknown error');
        toastProvider.error({ text: 'Ошибка при попытке поменять пароль' });
      }
    },
    [setIsActive],
  );

  return (
    <>
      <Button
        icon="pi pi-key"
        className={cn(styles.button, className)}
        onClick={() => setIsActive(true)}
        type="secondary"
      >
        Сменить пароль
      </Button>
      <Dialog
        visible={isActive}
        onHide={() => setIsActive(false)}
        footer={() => <FooterButtons formId={formId} />}
      >
        <form
          id={formId}
          onSubmit={handleSubmit(handlePasswordChange)}
          onReset={() => setIsActive(false)}
          className={styles.form}
        >
          <Controller
            name="oldPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input.Password
                {...field}
                label="Старый пароль"
                errorText={fieldState.error?.message}
                isInvalid={fieldState.invalid}
                showMeter
                fluid
              />
            )}
            rules={{ required: 'Поле обязательно для заполнения' }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input.Password
                {...field}
                label="Новый пароль"
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
        </form>
      </Dialog>
    </>
  );
}
