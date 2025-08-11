import { Response } from "express";
import { ERROR_MESSAGES } from "../constants/error-messages.constant";
import { SUCCESS_MESSAGES } from "../constants/success-messages.constant";

export class ApiResponse {
  // Success response
  static success(
    res: Response,
    data: any = null,
    message: string = SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Error response
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && {
        stack: new Error().stack,
      }),
    });
  }
}

// HTTP Exception class for throwing errors
export class HttpException extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "HttpException";

    Error.captureStackTrace(this, HttpException);
  }

  sendResponse(res: Response): void {
    ApiResponse.error(res, this.message, this.statusCode, this.details);
  }

  // Static factory methods for common HTTP errors
  static badRequest(
    message: string = ERROR_MESSAGES.BAD_REQUEST,
    details?: any
  ): HttpException {
    return new HttpException(message, 400, details);
  }

  static unauthorized(
    message: string = ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
    details?: any
  ): HttpException {
    return new HttpException(message, 401, details);
  }

  static forbidden(
    message: string = ERROR_MESSAGES.FORBIDDEN,
    details?: any
  ): HttpException {
    return new HttpException(message, 403, details);
  }

  static notFound(
    message: string = ERROR_MESSAGES.USER_NOT_FOUND,
    details?: any
  ): HttpException {
    return new HttpException(message, 404, details);
  }

  static conflict(
    message: string = ERROR_MESSAGES.CONFLICT,
    details?: any
  ): HttpException {
    return new HttpException(message, 409, details);
  }

  static internalServerError(
    message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    details?: any
  ): HttpException {
    return new HttpException(message, 500, details);
  }
}

export const httpException = {
  badRequest: HttpException.badRequest,
  unauthorized: HttpException.unauthorized,
  forbidden: HttpException.forbidden,
  notFound: HttpException.notFound,
  conflict: HttpException.conflict,
  internalServerError: HttpException.internalServerError,
};
