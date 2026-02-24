import type { PropsWithChildren } from 'react';
import { Skeleton as PrimeSkeleton } from 'primereact/skeleton';

type Props = {
  width?: string;
  height?: string;
  shape?: 'circle' | 'rectangle';
  className?: string;
  borderRadius?: string;
};

export function Skeleton({
  height,
  shape,
  width,
  children,
  borderRadius,
  className,
}: PropsWithChildren<Props>) {
  return (
    <PrimeSkeleton
      width={width}
      height={height}
      shape={shape}
      className={className}
      borderRadius={borderRadius}
    >
      {children}
    </PrimeSkeleton>
  );
}
