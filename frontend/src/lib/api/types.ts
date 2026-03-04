import type { ServerException } from '../exception';

type HttpMethods = 'get' | 'post' | 'put' | 'delete';

export interface HttpApiRequest<T = undefined> {
  url: string;
  data?: T;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  headers?: Record<string, string | null>;
  method?: HttpMethods;
}

export interface HttpApiResponse<T = undefined> {
  data: T;
}

export interface HttpApiError {
  status?: number;
}

export interface Api {
  onRequest(
    handler: <T>(request: HttpApiRequest<T>) => HttpApiRequest<T>,
  ): () => void;

  onError(
    handler: <T>(
      error: ServerException,
      request: HttpApiRequest<T>,
    ) => Promise<unknown>,
  ): () => void;
}

export interface HttpApi extends Api {
  get<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  post<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  put<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  delete<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;
}
