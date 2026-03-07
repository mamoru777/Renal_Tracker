import { type SyntheticEvent, useId } from 'react';
import cn from 'classnames';
import { InputSwitch } from 'primereact/inputswitch';
import { Message } from 'primereact/message';
import type { FormBooleanEvent } from 'primereact/ts-helpers';
import styles from './toggle.module.css';

type Props = {
  checked: boolean;
  className?: string;
  label?: string;
  errorText?: string;
  onChange?: (e: FormBooleanEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  tooltip?: string;
};

export function Toggle({
  className,
  disabled,
  errorText,
  isInvalid,
  label,
  onChange,
  onBlur,
  checked,
  tooltip,
}: Props) {
  const id = useId();

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.label}>
        <label htmlFor={id} className={styles.labelText}>
          {label}
        </label>
        <InputSwitch
          inputId={id}
          onChange={onChange}
          onBlur={onBlur}
          checked={checked}
          disabled={disabled}
          invalid={isInvalid || Boolean(errorText)}
          tooltip={tooltip}
        />
      </div>

      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
