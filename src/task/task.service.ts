import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TaskStatusChangeDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskAssignedUserDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { IJwtResponse } from 'src/auth/interface';
import { TASK_CONSTANT, USER_CONSTANT } from 'src/constant';
import { TASK_STATUS, Task } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, req: Request): Promise<Task> {
    try {
      const createdUser = (req['user'] as IJwtResponse).id;
      const task = await this.prismaService.task.create({
        data: {
          ...createTaskDto,
          createdUser,
        },
      });

      return task;
    } catch (err) {
      throw err;
    }
  }

  async getAllTask(status: TASK_STATUS, assignedUser: string, createdAt: Date) {
    try {
      return this.prismaService.task.findMany({
        where: {
          status: {
            equals: status,
          },
          assignUser: {
            contains: assignedUser,
          },
          createdAt: {
            equals: createdAt,
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getTaskById(id: string, userId: string | null = null): Promise<Task> {
    try {
      const task = await this.prismaService.task.findFirst({
        where: { id, ...(userId && { assignUser: userId }) },
      });
      if (!task)
        throw new NotFoundException(TASK_CONSTANT.TASK_RECORD_NOT_FOUND);

      return task;
    } catch (err) {
      throw err;
    }
  }

  async updateTask(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      const task = await this.getTaskById(id, userId);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: updateTaskDto,
      });
    } catch (err) {
      throw err;
    }
  }

  async changeTaskStatus(
    id: string,
    userId: string,
    taskStatusDto: TaskStatusChangeDto,
  ): Promise<Task> {
    try {
      const task = await this.getTaskById(id, userId);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: { status: taskStatusDto.status },
      });
    } catch (err) {
      throw err;
    }
  }

  async assignTaskUser(id: string, taskAssignedDto: TaskAssignedUserDto) {
    try {
      const task = await this.getTaskById(id);

      const user = await this.userService.getUserById(
        taskAssignedDto.assignedUser,
      );

      if (!user)
        throw new NotFoundException(USER_CONSTANT.USER_RECORD_NOT_FOUND);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: { assignUser: taskAssignedDto.assignedUser },
      });
    } catch (err) {
      throw err;
    }
  }

  async removeTask(id: string, userId: string): Promise<Task> {
    try {
      const task = await this.getTaskById(id, userId);
      return this.prismaService.task.delete({ where: { id: task.id } });
    } catch (err) {
      throw err;
    }
  }
}
