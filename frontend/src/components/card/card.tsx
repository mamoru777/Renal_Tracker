import type { PropsWithChildren } from 'react';
import { Card as PrimeCard } from 'primereact/card';

type Props = {
  title?: string;
  subTitle?: string;
  className?: string;
};

export function Card({
  children,
  subTitle,
  title,
  className,
}: PropsWithChildren<Props>) {
  return (
    <PrimeCard title={title} subTitle={subTitle} className={className}>
      {children}
    </PrimeCard>
  );
}
