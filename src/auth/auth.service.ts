import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LoginDto,
  LoginResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONSTANT } from 'src/constant';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  salt = 10;

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    try {
      const isEmailUnique = await this.prismaService.user.findUnique({
        where: { email: signupDto.email },
      });

      if (isEmailUnique)
        throw new ConflictException(AUTH_CONSTANT.EMAIL_ALREADY_TAKEN);

      const hashPassword = await bcrypt.hash(signupDto.password, this.salt);

      const user = this.prismaService.user.create({
        data: { ...signupDto, password: hashPassword },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user)
        throw new UnauthorizedException(AUTH_CONSTANT.INVALID_CREDENTIALS);

      const passwordMatched = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatched)
        throw new UnauthorizedException(AUTH_CONSTANT.INVALID_CREDENTIALS);

      const accessToken = this.createAccessToken(user.id);
      return {
        id: user.id,
        email: user.email,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  createAccessToken(userId: string): string {
    try {
      const accessToken = this.jwtService.sign(
        { userId },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRATION,
        },
      );

      return accessToken;
    } catch (err) {
      throw err;
    }
  }

  jwtExtractor() {
    return (req: Request) => {
      try {
        let token =
          req.headers['Authorization'] ||
          req.headers['authorization'] ||
          req.headers['Bearer'] ||
          req.headers['bearer'];

        if (token)
          token = String(token).replace('Bearer ', '').replace(' ', '');

        return token;
      } catch (err) {
        throw err;
      }
    };
  }
}
