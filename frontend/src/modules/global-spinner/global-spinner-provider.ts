import { spinnerStore } from './store';

interface SpinnerStore {
  setKeys: (resultResolver: (currKeys: Set<string>) => Set<string>) => void;
}

class GlobalSpinnerProvider {
  private store: SpinnerStore = spinnerStore.getState();
  private static _instance: GlobalSpinnerProvider | null = null;

  public static get instance() {
    if (!GlobalSpinnerProvider._instance) {
      GlobalSpinnerProvider._instance = new GlobalSpinnerProvider();
    }

    return GlobalSpinnerProvider._instance;
  }

  constructor() {}

  public startSpinner(key: string) {
    this.setSpinnerKey(key);
    return () => this.stopSpinner(key);
  }

  public stopSpinner(key: string) {
    this.deleteSpinnerKey(key);
  }

  private setSpinnerKey(key: string) {
    this.store.setKeys((currKeys) => currKeys.add(key));
  }

  private deleteSpinnerKey(key: string) {
    this.store.setKeys((currKeys) => {
      currKeys.delete(key);
      return currKeys;
    });
  }
}

export const globalSpinnerProvider = GlobalSpinnerProvider.instance;
