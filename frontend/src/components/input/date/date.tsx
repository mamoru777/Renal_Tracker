import { type SyntheticEvent, useId, useMemo } from 'react';
import cn from 'classnames';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { Message } from 'primereact/message';
import type { FormEvent } from 'primereact/ts-helpers';
import styles from './date.module.css';

type Props = {
  label?: string;
  value?: Date;
  errorText?: string;
  onChange?: (e: FormEvent<Date, SyntheticEvent>) => void;
  isInvalid?: boolean;
  fluid?: boolean;
  disabled?: boolean;
};

export function Date({
  label,
  onChange,
  value,
  errorText,
  isInvalid,
  fluid,
  disabled,
}: Props) {
  const id = useId();

  const ptOpts = useMemo(() => ({ input: { id } }), [id]);

  return (
    <div className={styles.container}>
      <FloatLabel className={cn({ 'p-fluid': fluid })}>
        <Calendar
          pt={ptOpts}
          onChange={onChange}
          value={value}
          invalid={isInvalid || Boolean(errorText)}
          className={cn({ 'p-fluid': fluid })}
          dateFormat="dd/mm/yy"
          locale="ru"
          disabled={disabled}
        />
        <label htmlFor={id}>{label}</label>
      </FloatLabel>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
