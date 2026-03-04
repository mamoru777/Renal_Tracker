import { useCallback } from 'react';
import cn from 'classnames';
import { Controller, useForm, Watch } from 'react-hook-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { appRoutes } from '@/constants/routes';
import { CREATININE_CURRENCY_OPTIONS } from '../../constants';
import { useGfrFetcher } from '../../context';
import { mapCalcUnauthFormToGfrParams } from '../../mappers';
import type { UnauthCalcForm } from '../../types';
import styles from './gfr-unauth-calculator.module.css';

type Props = {
  className?: string;
};

export function GfrUnauthCalculator({ className }: Props) {
  const { control, handleSubmit } = useForm<UnauthCalcForm>({
    defaultValues: {
      creatinine: undefined,
      creatinineCurrency: 'mg/dl',
      age: undefined,
      height: undefined,
      isAbsolute: false,
      sex: undefined,
      weight: undefined,
    },
    shouldUnregister: true,
  });
  const fetcher = useGfrFetcher();

  const onSubmit = useCallback(
    (data: UnauthCalcForm) => {
      fetcher.submit(JSON.stringify(mapCalcUnauthFormToGfrParams(data)), {
        method: 'post',
        action: appRoutes.CALC_GFR_UNAUTH,
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

      <Controller
        name="age"
        control={control}
        render={({ field, fieldState }) => (
          <Input.Number
            {...field}
            label="Возраст"
            errorText={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            fluid
          />
        )}
        rules={{
          required: true,
        }}
      />

      <div className={styles.flexbox}>
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
                shouldUnregister
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
              />
              <Controller
                name="weight"
                shouldUnregister
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
              />
            </>
          )
        }
      />
      <Button htmlType="submit">Расчитать СКФ</Button>
    </form>
  );
}
