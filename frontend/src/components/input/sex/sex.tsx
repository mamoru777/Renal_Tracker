import { type SyntheticEvent } from 'react';
import cn from 'classnames';
import { Message } from 'primereact/message';
import { SelectButton } from 'primereact/selectbutton';
import type { FormEvent } from 'primereact/ts-helpers';
import { SEX_OPTIONS } from './constants';
import styles from './sex.module.css';

type Props = {
  label?: string;
  value?: string;
  errorText?: string;
  onChange?: (e: FormEvent<string, SyntheticEvent>) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  fluid?: boolean;
};

export function Sex({
  disabled,
  errorText,
  isInvalid,
  label,
  onChange,
  value,
  fluid,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <span className={styles.labelText}>{label}</span>
        <SelectButton
          onChange={onChange}
          value={value}
          disabled={disabled}
          invalid={isInvalid || Boolean(errorText)}
          options={SEX_OPTIONS}
          className={cn({ 'p-fluid': fluid })}
        />
      </div>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
