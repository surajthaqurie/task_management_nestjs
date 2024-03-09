import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as bcrypt from 'bcrypt';
import { AUTH_CONSTANT } from 'src/constant';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(signupDto: SignupDto) {
    const isEmailUnique = await this.prismaService.user.findUnique({
      where: { email: signupDto.email },
    });

    if (isEmailUnique)
      throw new ConflictException(AUTH_CONSTANT.EMAIL_ALREADY_TAKEN);

    const hashPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.prismaService.user.create({
      data: { ...signupDto, password: hashPassword },
      select: { id: true, email: true, fullName: true, createdAt: true },
    });

    return user;
  }

  async login(loginDto: LoginDto) {
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

    return user;
  }
}
