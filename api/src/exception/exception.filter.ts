/*
https://docs.nestjs.com/exception-filters#exception-filters-1
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';

/**
 * AllExceptionsFilter catches all exceptions and returns a standard response
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: any =
      exception instanceof HttpException ? exception?.getResponse() : exception;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date(),
      path: request.url,
      message: message?.message || 'Internal server error',
    });
  }
}
