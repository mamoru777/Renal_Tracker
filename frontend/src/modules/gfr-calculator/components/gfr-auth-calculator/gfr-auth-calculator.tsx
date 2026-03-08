import { useCallback } from 'react';
import cn from 'classnames';
import { Controller, useForm, Watch } from 'react-hook-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { appRoutes } from '@/constants/routes';
import { useAuthenticatedUser } from '@/modules/user';
import { validateNotLaterThanNow } from '@/utils/validators';
import { CREATININE_CURRENCY_OPTIONS } from '../../constants';
import { useGfrFetcher } from '../../context';
import { mapCalcAuthFormToGfrParams } from '../../mappers';
import type { AuthCalcForm } from '../../types';
import styles from './gfr-auth-calculator.module.css';

type Props = {
  className?: string;
};

export function GfrAuthCalculator({ className }: Props) {
  const { user } = useAuthenticatedUser();

  const { control, handleSubmit, register } = useForm<AuthCalcForm>({
    defaultValues: {
      creatinine: undefined,
      creatinineCurrency: 'mg/dl',
      creatinineTestDate: new Date(),
      isAbsolute: false,
      height: user.height,
      weight: user.weight,
    },
    shouldUnregister: true,
  });

  const fetcher = useGfrFetcher();

  const onSubmit = useCallback(
    (data: AuthCalcForm) => {
      fetcher.submit(JSON.stringify(mapCalcAuthFormToGfrParams(data)), {
        method: 'post',
        action: appRoutes.CALC_GFR_AUTH,
        encType: 'application/json',
      });
    },
    [fetcher],
  );

  return (
    <form
      className={cn(styles.form, className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.addonGroup}>
        <Controller
          name="creatinine"
          control={control}
          render={({ field, fieldState }) => (
            <Input.Number
              {...field}
              label="Креатинин"
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
            />
          )}
          rules={{
            required: true,
          }}
        />
        <Controller
          name="creatinineCurrency"
          control={control}
          render={({ field, fieldState }) => (
            <Input.AddonSelect
              {...field}
              options={CREATININE_CURRENCY_OPTIONS}
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              labelPath="label"
              valuePath="value"
              posRight
            />
          )}
          rules={{
            required: true,
          }}
        />
      </div>

      {!user.birthdate && (
        <Controller
          name="age"
          control={control}
          render={({ field, fieldState }) => (
            <Input.Number
              {...field}
              label="Возраст в день анализов"
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              fluid
            />
          )}
          rules={{
            required: true,
          }}
        />
      )}

      {!!user.sex && (
        <input type="hidden" {...register('sex')} value={user.sex} />
      )}

      <div className={styles.flexbox}>
        {!user.sex && (
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
        )}

        <Controller
          name="isAbsolute"
          control={control}
          render={({ field, fieldState }) => (
            <Input.Toggle
              {...field}
              label="Расчитать абсолютную ППТ"
              checked={field.value === true}
              errorText={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              className={styles.bsaToggle}
              tooltip={`При включении площадь поверхности тела будет подсчитана 
                исходя из роста и веса. По умолчанию расчет будет вестись
                по среднестатистическому значению (1.73)`}
            />
          )}
        />
      </div>

      <Watch
        control={control}
        name="isAbsolute"
        render={(isAbsolute) =>
          isAbsolute && (
            <>
              <Controller
                name="height"
                control={control}
                render={({ field, fieldState }) => (
                  <Input.Number
                    {...field}
                    label="Рост"
                    errorText={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    suffix=" см"
                    fluid
                  />
                )}
                shouldUnregister
              />
              <Controller
                name="weight"
                control={control}
                render={({ field, fieldState }) => (
                  <Input.Number
                    {...field}
                    label="Вес"
                    errorText={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    suffix=" кг"
                    fluid
                  />
                )}
                shouldUnregister
              />
            </>
          )
        }
      />
      <Controller
        name="creatinineTestDate"
        control={control}
        render={({ field, fieldState }) => (
          <Input.Date
            {...field}
            label="Дата анализа"
            errorText={fieldState.error?.message}
            fluid
            isInvalid={fieldState.invalid}
          />
        )}
        rules={{
          validate: validateNotLaterThanNow,
        }}
      />
      <Button htmlType="submit">Расчитать СКФ</Button>
    </form>
  );
}
