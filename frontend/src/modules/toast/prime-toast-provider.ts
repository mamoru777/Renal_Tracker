import { Toast as PrimeToast } from 'primereact/toast';
import { type ToastOptions, type ToastProvider } from './types';

class PrimeToastProvider implements ToastProvider {
  private static _instance: PrimeToastProvider | null = null;
  private ref: PrimeToast | null = null;

  public static get instance() {
    if (!PrimeToastProvider._instance) {
      PrimeToastProvider._instance = new PrimeToastProvider();
    }

    return PrimeToastProvider._instance;
  }

  constructor() {}

  public setRef(newRef: PrimeToast): void {
    if (this.ref) {
      console.warn('Toast reference has already been provided');
    }
    this.ref = newRef;
  }

  public deleteRef() {
    this.ref = null;
  }

  public error({ content, dismissAfter = 3000, header, text }: ToastOptions) {
    this.getRef().show({
      content,
      detail: text,
      life: dismissAfter,
      severity: 'error',
      summary: header,
    });
  }

  public warn({ content, dismissAfter = 3000, header, text }: ToastOptions) {
    this.getRef().show({
      content,
      detail: text,
      life: dismissAfter,
      severity: 'warn',
      summary: header,
    });
  }

  public info({ content, dismissAfter = 3000, header, text }: ToastOptions) {
    this.getRef().show({
      content,
      detail: text,
      life: dismissAfter,
      severity: 'info',
      summary: header,
    });
  }

  public success({ content, dismissAfter = 3000, header, text }: ToastOptions) {
    this.getRef().show({
      content,
      detail: text,
      life: dismissAfter,
      severity: 'success',
      summary: header,
    });
  }

  private getRef(): PrimeToast {
    if (!this.ref) {
      throw new Error('No toast reference provided');
    }

    return this.ref;
  }
}

export const toastProvider = PrimeToastProvider.instance;
