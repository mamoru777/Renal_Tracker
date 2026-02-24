import { Toast as PrimeToast } from 'primereact/toast';
import { toastProvider } from './prime-toast-provider';

export function Toast() {
  const ref = (el: PrimeToast | null) => {
    if (el) {
      toastProvider.setRef(el);
      return;
    }

    toastProvider.deleteRef();
  };

  return <PrimeToast ref={ref} />;
}
