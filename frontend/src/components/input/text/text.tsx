import { type SyntheticEvent, useId } from 'react';
import cn from 'classnames';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import styles from './text.module.css';

type Props = {
  label?: string;
  value?: string;
  errorText?: string;
  onChange?: (e: SyntheticEvent) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  fluid?: boolean;
};

export function Text({
  label,
  onChange,
  value,
  errorText,
  disabled,
  isInvalid,
  fluid,
}: Props) {
  const id = useId();

  return (
    <div className={styles.container}>
      <FloatLabel className={cn({ 'p-fluid': fluid })}>
        <InputText
          id={id}
          onChange={onChange}
          value={value}
          disabled={disabled}
          invalid={isInvalid || Boolean(errorText)}
          className={cn({ 'p-fluid': fluid })}
        />
        <label htmlFor={id}>{label}</label>
      </FloatLabel>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
