import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    const method = request.method;
    const url = request.url;
    const now = Date.now();

    const name = exception.meta?.target as string;
    const responseJson = {
      success: false,
      message: 'Internal Server Error',
    };
    switch (exception.code) {
      case 'P2002':
        responseJson['message'] =
          `This ${name} already exists. Please choose different ${name}`;
        response.status(HttpStatus.BAD_REQUEST).json(responseJson);
        break;

      case 'P2014':
        responseJson['message'] = `Invalid ID: ${name}`;
        response.status(HttpStatus.BAD_REQUEST).json(responseJson);
        break;

      case 'P2006':
        responseJson['message'] = `The provide value for ${name} is invalid`;
        response.status(HttpStatus.BAD_REQUEST).json(responseJson);
        break;

      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseJson);
        break;
    }

    Logger.error(
      `${method} ${url} ${Date.now() - now}ms ${JSON.stringify(responseJson)}`,
      PrismaExceptionFilter.name,
    );
  }
}
