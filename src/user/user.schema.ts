import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  id: string;
  email: string;
  fullName: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
