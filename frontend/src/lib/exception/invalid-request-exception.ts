export class InvalidRequestException extends Error {
  constructor(message: string) {
    super(message);
  }
}
