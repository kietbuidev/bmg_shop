import {HTTPCode} from './enums';

export class CustomError extends Error {
  statusCode: number;
  errorCode: string;
  option?: any;

  constructor(statusCode: number, errorCode: string, option: any = null, message: string = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.option = option;

    // Set the prototype explicitly
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class NotFoundError extends CustomError {
  constructor(message?: string) {
    super(HTTPCode.NOT_FOUND, message || 'The object not found!');
  }
}

// export class BadRequestError extends CustomError {
//   constructor(message: string) {
//     super(HTTPCode.BAD_REQUEST, message);
//   }
// }

export class ApplicationError extends CustomError {
  constructor(message: string) {
    super(500, message);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string) {
    super(503, message);
  }
}
