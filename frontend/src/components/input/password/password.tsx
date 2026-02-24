import { type SyntheticEvent, useId } from 'react';
import cn from 'classnames';
import { FloatLabel } from 'primereact/floatlabel';
import { Message } from 'primereact/message';
import { Password as PrimePassword } from 'primereact/password';
import styles from './password.module.css';

type Props = {
  label?: string;
  value?: string;
  errorText?: string;
  onChange?: (e: SyntheticEvent) => void;
  showMeter?: boolean;
  isInvalid?: boolean;
  fluid?: boolean;
};

export function Password({
  label,
  onChange,
  value,
  errorText,
  showMeter,
  isInvalid,
  fluid,
}: Props) {
  const id = useId();

  return (
    <div className={styles.container}>
      <FloatLabel className={cn({ 'p-fluid': fluid })}>
        <PrimePassword
          pt={{ input: { id } }}
          toggleMask
          onChange={onChange}
          value={value}
          feedback={showMeter}
          invalid={isInvalid || Boolean(errorText)}
          className={cn({ 'p-fluid': fluid })}
          mediumLabel="Средний"
          weakLabel="Слабый"
          strongLabel="Отличный"
          promptLabel="Придумайте пароль"
        />
        <label htmlFor={id}>{label}</label>
      </FloatLabel>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
