type ServerExceptionParams = {
  message: string;
  statusCode?: number;
};

export class ServerException extends Error {
  private _message: string;
  private _statusCode?: number;
  private _originalError: Error;

  get message(): string {
    return this._message;
  }

  get originalError(): Error {
    return this._originalError;
  }

  get statusCode(): number | undefined {
    return this._statusCode;
  }

  constructor(params: ServerExceptionParams, originalError: Error) {
    super(params.message);
    this._message = params.message;
    this._statusCode = params.statusCode;
    this._originalError = originalError;
  }
}
