import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errResponse = exception.getResponse();

    const responseJson = {
      success: false,
      statusCode: status,
      message:
        typeof errResponse === 'object'
          ? (errResponse as { message: string })['message']
          : errResponse,
    };

    response.status(status).json(responseJson);
  }
}
