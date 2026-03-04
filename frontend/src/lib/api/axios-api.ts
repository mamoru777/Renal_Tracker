import axios, {
  type AxiosInstance,
  type AxiosResponse,
  isAxiosError,
} from 'axios';
import { InvalidCredentialsException, ServerException } from '../exception';
import { type HttpApi, type HttpApiRequest } from './types';

type ApiParams<T = undefined> = {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string | null>;
};

type ApiConstructorParams = {
  baseUrl?: string;
};

const defaultReqHandler = <T>(req: HttpApiRequest<T>) => req;
const defaultErrHandler = (e: unknown) => {
  throw e;
};

export class AxiosApi implements HttpApi {
  private _axios: AxiosInstance;

  private _reqHandler: <T>(request: HttpApiRequest<T>) => HttpApiRequest<T> =
    defaultReqHandler;
  private _errHandler: <T>(
    error: ServerException,
    request: HttpApiRequest,
  ) => Promise<T> = defaultErrHandler;

  constructor({ baseUrl }: ApiConstructorParams) {
    this._axios = axios.create({
      baseURL: baseUrl,
    });
    this._axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  private async send<Rq, Rs>({
    method,
    url,
    data,
    params,
    headers,
  }: ApiParams<Rq>): Promise<AxiosResponse<Rs>> {
    try {
      const req = {
        ...this._reqHandler({
          url,
          data,
          params,
          headers,
        }),
        method,
        withCredentials: true,
      };

      return await this._axios.request<Rs, AxiosResponse<Rs, Rq>, Rq>(req);
    } catch (e: unknown) {
      if (isAxiosError<Rs, Rq>(e)) {
        if (e.response) {
          const serverError =
            e.status === 401
              ? new InvalidCredentialsException(e)
              : new ServerException(
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

          if (this._errHandler && e.config) {
            return await this._errHandler(
              serverError,
              e.config as HttpApiRequest,
            );
          }

          throw serverError;
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
      method: 'get',
    });
  }

  public post<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'post',
    });
  }

  public put<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'put',
    });
  }

  public delete<Rq, Rs>(
    request: Omit<ApiParams<Rq>, 'method'>,
  ): Promise<AxiosResponse<Rs>> {
    return this.send<Rq, Rs>({
      ...request,
      method: 'delete',
    });
  }

  public onRequest(
    handler: <T>(request: HttpApiRequest<T>) => HttpApiRequest<T>,
  ): () => void {
    this._reqHandler = handler;
    return () => (this._reqHandler = defaultReqHandler);
  }

  public onError(
    handler: <T>(error: ServerException, request: HttpApiRequest) => Promise<T>,
  ): () => void {
    this._errHandler = handler;
    return () => (this._errHandler = defaultErrHandler);
  }
}
