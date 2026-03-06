import { data } from 'react-router';
import { ServerException } from '@/lib/exception';

export function getUserIdFromToken(token?: string): string | undefined {
  if (!token) {
    return undefined;
  }
  const claims = getTokenClaims(token);
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

export function getTokenExpirationTime(token: string): Date {
  return new Date(getTokenClaims(token).exp * 1000);
}

interface DataWithResponseInit<D> {
  data: D;
  init: ResponseInit | null;
}

export function resolvePageLoaderError<T = unknown>(
  e: T,
): DataWithResponseInit<{ error: T }> {
  if (e instanceof ServerException) {
    return data({ error: e }, { status: e.statusCode, statusText: e.message });
  }

  return data(
    { error: e },
    {
      status: 500,
      statusText: e instanceof Error ? e.message : 'Неизвестная ошибка',
    },
  );
}

export function calculateAge(birthDate: Date) {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Если день рождения в этом году еще не наступил — вычитаем 1 год
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
