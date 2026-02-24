import { data } from 'react-router';
import { ServerException } from '@/lib/exception';

export function getUserIdFromToken(token?: string): string | undefined {
  if (!token) {
    return undefined;
  }

  const claims = getTokenClaims(token);

  if (isTokenStale(token)) {
    return undefined;
  }

  return claims.CustomClaims.userID;
}

function getTokenClaims(token: string) {
  const payload = token.split('.')[1];
  const decodedPayload = window.atob(payload);
  return JSON.parse(decodedPayload);
}

export function isTokenStale(token: string): boolean {
  return getTokenClaims(token).exp < Date.now() / 1000;
}

interface DataWithResponseInit<D> {
  data: D;
  init: ResponseInit | null;
}

export function resolvePageLoaderError<T = unknown>(
  e: T,
): DataWithResponseInit<T> {
  if (e instanceof ServerException) {
    return data(e, { status: e.statusCode, statusText: e.message });
  }

  return data(e, {
    status: 500,
    statusText: e instanceof Error ? e.message : 'Неизвестная ошибка',
  });
}
