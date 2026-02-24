export interface HttpApiRequest<T = undefined> {
  url: string;
  data?: T;
  params?: Record<string, unknown>;
}

export interface HttpApiResponse<T = undefined> {
  data: T;
}

export interface HttpApi {
  get<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  post<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  put<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;

  delete<T, U>(request: HttpApiRequest<T>): Promise<HttpApiResponse<U>>;
}
