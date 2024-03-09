import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.prisma.user.delete({ where: { id } });
  }
}
