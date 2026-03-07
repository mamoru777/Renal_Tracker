import { type FocusEvent, type SyntheticEvent, useId } from 'react';
import cn from 'classnames';
import { Dropdown } from 'primereact/dropdown';
import type { FormEvent } from 'primereact/ts-helpers';
import styles from './addon-select.module.css';

type Props<T extends { [key: string]: string }, V extends keyof T> = {
  options: T[];
  labelPath: keyof T extends string ? string : never;
  valuePath: V extends string ? string : never;
  value?: T[V];
  defaultValue?: T[V];
  errorText?: string;
  onChange?: (e: FormEvent<T[V], SyntheticEvent>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  className?: string;
  fluid?: boolean;
  posLeft?: boolean;
  posRight?: boolean;
};

export function AddonSelect<
  T extends Record<string, string>,
  V extends keyof T,
>({
  className,
  options,
  isInvalid,
  labelPath,
  defaultValue,
  onChange,
  onBlur,
  value,
  valuePath,
  posLeft,
  posRight,
}: Props<T, V>) {
  const id = useId();

  return (
    <Dropdown
      className={cn(styles.select, className, {
        [styles.right]: posRight,
        [styles.left]: posLeft,
      })}
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
  );
}
