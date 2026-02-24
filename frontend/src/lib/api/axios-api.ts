import axios, {
  type AxiosInstance,
  type AxiosResponse,
  isAxiosError,
} from 'axios';
import { InvalidCredentialsException, ServerException } from '../exception';
import { type HttpApi } from './types';

type ApiParams<T = undefined> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: T;
  params?: Record<string, unknown>;
};

type ApiConstructorParams = {
  baseUrl?: string;
};

export class AxiosApi implements HttpApi {
  private axios: AxiosInstance;

  constructor({ baseUrl }: ApiConstructorParams) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
    this.axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  /** for interceptors */
  public get axiosInstance() {
    return this.axios;
  }

  private async send<Rq, Rs>({
    method,
    url,
    data,
    params,
  }: ApiParams<Rq>): Promise<AxiosResponse<Rs>> {
    try {
      return await this.axios.request<Rs>({
        method,
        url,
        data,
        params,
        withCredentials: true,
      });
    } catch (e: unknown) {
      if (isAxiosError<Rs>(e)) {
        if (e.response) {
          if (e.status === 401) {
            throw new InvalidCredentialsException(e);
          }

          throw new ServerException(
            {
              message:
                e.response.data &&
                typeof e.response.data === 'object' &&
                'message' in e.response.data &&
                typeof e.response.data.message === 'string' &&
                e.response.data.message
                  ? e.response.data.message
                  : e.message,

              statusCode: e.response.status,
            },
            e,
          );
        }
      }

      const message = e instanceof Error ? e.message : 'Not instance of error';

      throw new Error(`unknown Api error: ${message}`);
    }
  }

  public get<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'GET',
    });
  }

  public post<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'POST',
    });
  }

  public put<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'PUT',
    });
  }

  public delete<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'DELETE',
    });
  }
}
