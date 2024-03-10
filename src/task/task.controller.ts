import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  Put,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  TaskStatusChangeDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { COMMON_ERROR, TASK_CONSTANT } from 'src/constant';
import { AppResponse } from 'src/utils';
import { Task } from '@prisma/client';

@ApiTags('Task')
@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Task.' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_CREATED_SUCCESS,
  })
  async createTask(
    @Req() req: Request,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.createTask(createTaskDto, req);
    return new AppResponse<Task>(TASK_CONSTANT.TASK_CREATED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all task.' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    isArray: true,
    description: TASK_CONSTANT.TASKS_FETCHED_SUCCESS,
  })
  async getAllTask(): Promise<AppResponse<Task[]>> {
    const tasks = await this.taskService.getAllTask();
    return new AppResponse<Task[]>(TASK_CONSTANT.TASKS_FETCHED_SUCCESS)
      .setStatus(200)
      .setSuccessData(tasks);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get task details by Id.' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_DETAIL_FETCHED_SUCCESS,
  })
  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<AppResponse<Task>> {
    const task = await this.taskService.getTaskById(id);
    return new AppResponse<Task>(TASK_CONSTANT.TASK_DETAIL_FETCHED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update task.' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_UPDATE_SUCCESS,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.updateTask(id, updateTaskDto);
    return new AppResponse<Task>(TASK_CONSTANT.TASK_UPDATE_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Patch('status/:id')
  async changeTaskStatus(
    @Body() taskStatusDto: TaskStatusChangeDto,
    @Param('id') taskId: string,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.changeTaskStatus(taskId, taskStatusDto);

    return new AppResponse<Task>(TASK_CONSTANT.TASK_STATUS_CHANGED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove task.' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_DELETED_SUCCESS,
  })
  async removeTask(@Param('id') id: string): Promise<AppResponse<Task>> {
    const task = await this.taskService.removeTask(id);
    return new AppResponse<Task>(TASK_CONSTANT.TASK_DELETED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }
}
