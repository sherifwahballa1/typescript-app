import Logger from '../utils/Logger';
import { CustomError } from './custom-error';

interface interalErrorInfo {
  statusMessage: string;
  message: string;
  originalUrl: string;
  method: string;
  ip: string;
}

export class InternalServerError extends CustomError {
  statusCode = 500;

  constructor(public errorInfo: interalErrorInfo) {
    super('500 Internal server error');

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    Logger.error(`${500} - ${this.errorInfo.statusMessage} - ${this.errorInfo.message} - ${this.errorInfo.originalUrl} - ${this.errorInfo.method} - ${this.errorInfo.ip}`);
    return [{ message: this.errorInfo.message }];
  }
}
