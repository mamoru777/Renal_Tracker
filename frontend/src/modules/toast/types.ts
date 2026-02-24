import type { ReactNode } from 'react';

export type ToastOptions = {
  text?: string;
  content?: ReactNode;
  dismissAfter?: number;
  header?: string;
};

export interface ToastProvider {
  error(options: ToastOptions): void;
  warn(options: ToastOptions): void;
  info(options: ToastOptions): void;
  success(options: ToastOptions): void;
}
