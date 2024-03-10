import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatusChangeDto, CreateTaskDto, UpdateTaskDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { IJwtResponse } from 'src/auth/interface';
import { TASK_CONSTANT } from 'src/constant';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async getAllTask() {
    try {
      return this.prismaService.task.findMany({});
    } catch (err) {
      throw err;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.prismaService.task.findUnique({ where: { id } });
      if (!task)
        throw new NotFoundException(TASK_CONSTANT.TASK_RECORD_NOT_FOUND);

      return task;
    } catch (err) {
      throw err;
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.getTaskById(id);

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
    taskStatusDto: TaskStatusChangeDto,
  ): Promise<Task> {
    try {
      const task = await this.getTaskById(id);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: { status: taskStatusDto.status },
      });
    } catch (err) {
      throw err;
    }
  }

  async removeTask(id: string): Promise<Task> {
    try {
      const task = await this.getTaskById(id);
      return this.prismaService.task.delete({ where: { id: task.id } });
    } catch (err) {
      throw err;
    }
  }
}
