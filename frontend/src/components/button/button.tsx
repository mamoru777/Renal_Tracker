import type { PropsWithChildren, ReactNode } from 'react';
import { Button as PrimeButton } from 'primereact/button';

type Props = {
  htmlType?: 'button' | 'reset' | 'submit';
  onClick?: () => void;
  className?: string;
  icon?: string;
  formId?: string;
  type?: 'secondary' | 'danger';
  renderChildren?: () => ReactNode;
  label?: string;
};

export function Button({
  htmlType = 'button',
  children,
  formId,
  className,
  onClick,
  icon,
  type,
  label,
}: PropsWithChildren<Props>) {
  let resolvedChildren: ReactNode = children;
  let resolvedLabel = label;

  if (typeof children === 'string') {
    resolvedLabel = children;
    resolvedChildren = null;
  }

  return (
    <PrimeButton
      type={htmlType}
      onClick={onClick}
      className={className}
      icon={icon}
      severity={type}
      label={resolvedLabel}
      form={formId}
    >
      {resolvedChildren}
    </PrimeButton>
  );
}
