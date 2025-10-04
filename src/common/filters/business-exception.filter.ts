import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // Check if it's a business exception with structured error
    const isBusinessException =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'code' in exceptionResponse;

    let errorResponse;

    if (isBusinessException) {
      // Business exception with structured error
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        ...exceptionResponse, // This includes message, error, code, and any additional fields
      };
    } else {
      // Standard HTTP exception
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any)?.message || 'Internal server error',
        error: this.getErrorName(status),
      };
    }

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(errorResponse)}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST as number:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED as number:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN as number:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND as number:
        return 'Not Found';
      case HttpStatus.CONFLICT as number:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY as number:
        return 'Unprocessable Entity';
      case HttpStatus.INTERNAL_SERVER_ERROR as number:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
