import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    let name: string;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        name = exception.meta?.target as string;
        message = `This ${name} already exists. Please choose different ${name}`;
        response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message,
        });
        break;
      case 'P2014':
        name = exception.meta?.target as string;
        message = `Invalid ID: ${name}`;
        response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message,
        });
        break;
      case 'P2006':
        name = exception.meta?.target as string;
        message = `The provide value for ${name} is invalid`;
        response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message,
        });
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal Server Error',
        });
        break;
    }
  }
}
