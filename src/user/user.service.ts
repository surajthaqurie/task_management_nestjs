import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string): Promise<UserResponseDto | null> {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
