import { type SyntheticEvent, useCallback, useId, useMemo } from 'react';
import cn from 'classnames';
import { FloatLabel } from 'primereact/floatlabel';
import {
  InputNumber,
  type InputNumberChangeEvent,
} from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import styles from './numeric.module.css';

type Props = {
  label?: string;
  value?: number | string;
  errorText?: string;
  onChange?: (e: SyntheticEvent) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  fluid?: boolean;
  suffix?: string;
  prefix?: string;
};

export function Numeric({
  label,
  onChange,
  value,
  errorText,
  disabled,
  isInvalid,
  fluid,
  prefix,
  suffix,
}: Props) {
  const id = useId();

  const onChangeEvent = useCallback(
    ({ originalEvent, value }: InputNumberChangeEvent) => {
      onChange?.({
        ...originalEvent,
        target: {
          ...originalEvent.target,
          value,
        },
      } as SyntheticEvent);
    },
    [onChange],
  );

  const resolvedValue = useMemo(() => {
    switch (true) {
      case value === undefined:
      case value === null:
      case value === '':
        return undefined;

      default:
        return Number(value);
    }
  }, [value]);

  return (
    <div className={styles.container}>
      <FloatLabel className={cn({ 'p-fluid': fluid })}>
        <InputNumber
          inputId={id}
          onChange={onChangeEvent}
          value={resolvedValue}
          disabled={disabled}
          invalid={isInvalid || Boolean(errorText)}
          className={cn({ 'p-fluid': fluid })}
          allowEmpty
          useGrouping={false}
          prefix={prefix}
          suffix={suffix}
          maxFractionDigits={5}
        />
        <label htmlFor={id}>{label}</label>
      </FloatLabel>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
