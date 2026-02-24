import type { PropsWithChildren } from 'react';
import cn from 'classnames';
import styles from './page-section.module.css';

type Props = {
  className?: string;
};

export function PageSection({ children, className }: PropsWithChildren<Props>) {
  return <div className={cn(styles.section, className)}>{children}</div>;
}
