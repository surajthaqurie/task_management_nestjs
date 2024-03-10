import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserResponseDto[]> {
    try {
      return this.prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string): Promise<UserResponseDto | null> {
    try {
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
    } catch (err) {
      throw err;
    }
  }
}
