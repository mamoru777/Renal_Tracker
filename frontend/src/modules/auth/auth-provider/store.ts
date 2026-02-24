import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CookieStorage } from '@/lib/storage';

const cookieStorage = new CookieStorage();

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  setTokens: (accessToken: string | undefined, refreshToken?: string) => void;
};

export const authStore = createStore<AuthState>()(
  devtools((set) => ({
    accessToken: undefined,
    refreshToken: undefined,
    setTokens(
      accessToken: string | undefined,
      refreshToken: string | undefined,
    ): void {
      if (refreshToken) {
        cookieStorage.add('refreshToken', refreshToken, {
          samesite: 'lax',
          path: '/',
        });
      } else {
        cookieStorage.remove('refreshToken');
      }

      if (accessToken) {
        cookieStorage.add('accessToken', accessToken, {
          samesite: 'lax',
          path: '/',
        });
      } else {
        cookieStorage.remove('accessToken');
      }

      set({ accessToken, refreshToken });
    },
  })),
);
