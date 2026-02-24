import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

type GlobalSpinnerState = {
  activeKeys: Set<string>;
  setKeys(
    resultOrFunc: Set<string> | ((currKeys: Set<string>) => Set<string>),
  ): Set<string>;
};

export const spinnerStore = createStore<GlobalSpinnerState>()(
  devtools((set, get) => ({
    activeKeys: new Set<string>([]),
    setKeys(
      resultOrFunc: Set<string> | ((currKeys: Set<string>) => Set<string>),
    ) {
      const result =
        typeof resultOrFunc === 'function'
          ? resultOrFunc(get().activeKeys)
          : resultOrFunc;
      set({ activeKeys: result });
      return get().activeKeys;
    },
  })),
);
