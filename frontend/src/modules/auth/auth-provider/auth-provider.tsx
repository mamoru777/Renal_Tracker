import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Outlet } from 'react-router';
import { useStore } from 'zustand';
import { CookieStorage } from '@/lib/storage';
import { renalTrackerApi } from '@/services/api';
import { isTokenStale } from '@/utils/helpers';
import { authStore } from './store';

const cookieStorage = new CookieStorage();

export function AuthProvider() {
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const { setTokens } = useStore(authStore);

  useEffect(() => {
    const cookieAccessToken = cookieStorage.get('accessToken');
    const cookieRefreshToken = cookieStorage.get('refreshToken');

    if (cookieRefreshToken && isTokenStale(cookieRefreshToken)) {
      cookieStorage.remove('accessToken');
      cookieStorage.remove('refreshToken');
    } else if (cookieAccessToken && cookieRefreshToken) {
      setTokens(cookieAccessToken, cookieRefreshToken);
      renalTrackerApi.axiosInstance.defaults.headers.common.Authorization = `Bearer ${cookieAccessToken}`;
    }

    renalTrackerApi.axiosInstance.interceptors.response.use(
      (r) => {
        const accessTokenFromHeaders = r?.headers?.['accesstoken'];
        const refreshTokenFromHeaders = r?.headers?.['refreshtoken'];

        if (accessTokenFromHeaders && refreshTokenFromHeaders) {
          setTokens(accessTokenFromHeaders, refreshTokenFromHeaders);
        }
        return r;
      },
      (e) => {
        if (isAxiosError(e)) {
          const accessTokenFromHeaders = e?.response?.headers?.['accesstoken'];
          const refreshTokenFromHeaders =
            e?.response?.headers?.['refreshtoken'];

          if (accessTokenFromHeaders && refreshTokenFromHeaders) {
            setTokens(accessTokenFromHeaders, refreshTokenFromHeaders);
          }
        }
        throw e;
      },
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsApiInitialized(true);
  }, [setTokens, setIsApiInitialized]);

  return isApiInitialized ? <Outlet /> : null;
}
