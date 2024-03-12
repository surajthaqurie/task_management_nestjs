import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  TaskStatusChangeDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskAssignedUserDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TASK_CONSTANT, USER_CONSTANT } from 'src/constant';
import { TASK_STATUS, Task } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const logger = new Logger(TaskService.name + '-createTask');
    try {
      const task = await this.prismaService.task.create({
        data: {
          ...createTaskDto,
          createdUser: userId,
        },
      });

      return task;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getAllTask(query: {
    status?: TASK_STATUS;
    assignedUser?: string;
    createdAt?: Date;
  }) {
    const logger = new Logger(TaskService.name + '-getAllTask');
    try {
      return this.prismaService.task.findMany({
        where: {
          status: {
            equals: query.status,
          },
          assignUser: {
            contains: query.assignedUser,
          },
          createdAt: {
            equals: query.createdAt,
          },
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    const logger = new Logger(TaskService.name + '-getTaskById');
    try {
      const task = await this.prismaService.task.findFirst({
        where: { id },
      });
      if (!task)
        throw new NotFoundException(TASK_CONSTANT.TASK_RECORD_NOT_FOUND);

      return task;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateTask(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const logger = new Logger(TaskService.name + '-updateTask');
    try {
      const task = await this.getTaskById(id);

      if (task.assignUser && task.assignUser !== userId)
        throw new ForbiddenException(TASK_CONSTANT.FORBIDDEN_UPDATE_TASK);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: updateTaskDto,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async changeTaskStatus(
    id: string,
    userId: string,
    taskStatusDto: TaskStatusChangeDto,
  ): Promise<Task> {
    const logger = new Logger(TaskService.name + '-changeTaskStatus');
    try {
      const task = await this.getTaskById(id);

      if (task.assignUser !== userId)
        throw new ForbiddenException(
          TASK_CONSTANT.FORBIDDEN_STATUS_CHANGE_TASK,
        );

      return this.prismaService.task.update({
        where: { id: task.id },
        data: { status: taskStatusDto.status },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async assignTaskUser(id: string, taskAssignedDto: TaskAssignedUserDto) {
    const logger = new Logger(TaskService.name + '-assignTaskUser');
    try {
      const task = await this.getTaskById(id);

      const user = await this.userService.getUserById(
        taskAssignedDto.assignedUser,
      );

      if (!user)
        throw new NotFoundException(USER_CONSTANT.USER_RECORD_NOT_FOUND);

      if (task.assignUser && task.assignUser !== user.id)
        throw new ForbiddenException(TASK_CONSTANT.FORBIDDEN_ASSIGN_TASK);

      return this.prismaService.task.update({
        where: { id: task.id },
        data: { assignUser: taskAssignedDto.assignedUser },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async removeTask(id: string, userId: string): Promise<Task> {
    const logger = new Logger(TaskService.name + '-removeTask');
    try {
      const task = await this.getTaskById(id);

      if (task.assignUser && task.assignUser !== userId)
        throw new ForbiddenException(TASK_CONSTANT.FORBIDDEN_DELETE_TASK);

      return this.prismaService.task.delete({ where: { id: task.id } });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
