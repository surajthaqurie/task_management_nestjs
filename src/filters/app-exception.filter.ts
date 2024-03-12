import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

type IErrorResponse = { message: string };
interface IResponseJson {
  success: boolean;
  statusCode: number;
  message: string;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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

      this.logger(request, responseJson);
      response.status(statusCode).json(responseJson);
    } else {
      const responseJson = {
        success: false,
        statusCode,
        message: 'Internal server error: ' + errorMessage,
      };

      this.logger(request, responseJson);
      response.status(statusCode).json(responseJson);
    }
  }

  logger(request: Request, responseJson: IResponseJson) {
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    Logger.error(
      `${method} ${url} ${Date.now() - now}ms ${JSON.stringify(responseJson)}`,
      AppExceptionFilter.name,
    );
  }
}
