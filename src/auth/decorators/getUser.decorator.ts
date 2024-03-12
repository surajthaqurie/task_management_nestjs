import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const getUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const logger = new Logger('GetUserDecorator');
    try {
      const request = ctx.switchToHttp().getRequest();
      if (data) {
        return request.user[data];
      }
      return request.user;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },
);
