import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { IJwtPayload, IJwtResponse } from '../interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
    authService: AuthService,
  ) {
    super({
      jwtFromRequest: authService.jwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtResponse> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.userId },
        select: { id: true },
      });
      if (!user) throw new UnauthorizedException();

      return user;
    } catch (err) {
      throw err;
    }
  }
}
