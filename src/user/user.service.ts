import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { IUser } from './interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<IUser[]> {
    const logger = new Logger(UserService.name + '-getUsers');
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
      logger.error(err);
      throw err;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    const logger = new Logger(UserService.name + '-getUserById');
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
      logger.error(err);
      throw err;
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    const logger = new Logger(UserService.name + '-deleteUser');
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
      logger.error(err);
      throw err;
    }
  }
}
