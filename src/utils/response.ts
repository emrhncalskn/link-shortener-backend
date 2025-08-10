import { Response } from "express";

export class ApiResponse {
  // Success response
  static success(
    res: Response,
    data: any = null,
    message: string = "Success",
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
    message: string = "Bad Request",
    details?: any
  ): HttpException {
    return new HttpException(message, 400, details);
  }

  static unauthorized(
    message: string = "Unauthorized",
    details?: any
  ): HttpException {
    return new HttpException(message, 401, details);
  }

  static forbidden(
    message: string = "Forbidden",
    details?: any
  ): HttpException {
    return new HttpException(message, 403, details);
  }

  static notFound(message: string = "Not Found", details?: any): HttpException {
    return new HttpException(message, 404, details);
  }

  static conflict(message: string = "Conflict", details?: any): HttpException {
    return new HttpException(message, 409, details);
  }

  static internalServerError(
    message: string = "Internal Server Error",
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
