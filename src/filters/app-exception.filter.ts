import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

type IErrorResponse = { message: string };

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorMessage = exception.message;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const errResponse = exception.getResponse() as IErrorResponse | string;

      const responseJson = {
        success: false,
        statusCode,
        message:
          typeof errResponse === 'object'
            ? errResponse['message']
            : errResponse,
      };

      response.status(statusCode).json(responseJson);
    } else {
      const responseJson = {
        success: false,
        statusCode,
        message: 'Internal server error: ' + errorMessage,
      };
      response.status(statusCode).json(responseJson);
    }
  }
}
