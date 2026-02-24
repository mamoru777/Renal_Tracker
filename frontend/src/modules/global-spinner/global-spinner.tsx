import { useStore } from 'zustand';
import { Spinner } from '@/components/spinner';
import { spinnerStore } from './store';

export function GlobalSpinner() {
  const isActive = useStore(spinnerStore, ({ activeKeys }) =>
    Boolean(activeKeys.size),
  );

  return <Spinner fullScreen active={isActive} />;
}
