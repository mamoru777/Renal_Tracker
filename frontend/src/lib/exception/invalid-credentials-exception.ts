import { ServerException } from './server-exception';

export class InvalidCredentialsException extends ServerException {
  constructor(e: Error) {
    super({ message: 'Invalid credentials', statusCode: 401 }, e);
  }
}
