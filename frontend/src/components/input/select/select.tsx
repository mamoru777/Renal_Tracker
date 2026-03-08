import { type SyntheticEvent, useId } from 'react';
import cn from 'classnames';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Message } from 'primereact/message';
import type { FormEvent } from 'primereact/ts-helpers';
import styles from './select.module.css';

type Props<T extends { [key: string]: string }, V extends keyof T> = {
  options: T[];
  labelPath: keyof T extends string ? string : never;
  valuePath: V extends string ? string : never;
  value?: T[V];
  defaultValue?: T[V];
  label?: string;
  errorText?: string;
  onChange?: (e: FormEvent<T[V], SyntheticEvent>) => void;
  onBlur?: (e: SyntheticEvent) => void;
  isInvalid?: boolean;
  className?: string;
  fluid?: boolean;
};

export function Select<T extends Record<string, string>, V extends keyof T>({
  className,
  options,
  errorText,
  fluid,
  isInvalid,
  label,
  labelPath,
  defaultValue,
  onChange,
  onBlur,
  value,
  valuePath,
}: Props<T, V>) {
  const id = useId();

  return (
    <div className={styles.container}>
      <FloatLabel className={cn({ 'p-fluid': fluid })}>
        <Dropdown
          className={cn(styles.select, className)}
          options={options}
          optionLabel={labelPath}
          optionValue={valuePath}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          invalid={isInvalid}
          id={id}
          defaultValue={defaultValue}
        />
        <label htmlFor={id}>{label}</label>
      </FloatLabel>
      {errorText && (
        <Message severity="error" text={errorText} className={styles.message} />
      )}
    </div>
  );
}
