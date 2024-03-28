import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IJwtPayload } from '../interface';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const logger = new Logger(PermissionGuard.name + '-canActivate');
        try {
            // Get data from decorator ex: @Permission('R')
            const permission = this.reflector.get<string[]>('permission', context.getHandler());
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            const feature = this.reflector.get<string[]>('feature', context.getHandler());

            if (!permission || !feature) return true;

            const request = context.switchToHttp().getRequest();
            const user = request.user;

            return true;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
