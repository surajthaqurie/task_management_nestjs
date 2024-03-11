import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  TaskStatusChangeDto,
  TaskResponseDto,
  UpdateTaskDto,
  TaskAssignedUserDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { COMMON_ERROR, TASK_CONSTANT, USER_CONSTANT } from 'src/constant';
import { AppResponse } from 'src/utils';
import { TASK_STATUS, Task } from '@prisma/client';
import { IJwtResponse } from 'src/auth/interface';

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
    try {
      const task = await this.taskService.createTask(createTaskDto, req);
      return new AppResponse<Task>(TASK_CONSTANT.TASK_CREATED_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all task.' })
  @ApiQuery({
    name: 'status',
    enum: TASK_STATUS,
    required: false,
    description: 'Status of task',
  })
  @ApiQuery({
    name: 'assignedUser',
    type: 'string',
    required: false,
    description: 'Id of assigned user.',
  })
  @ApiQuery({
    name: 'createdAt',
    type: 'Date',
    required: false,
    description: 'Created date of task.',
  })
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
  async getAllTask(
    @Query('status') status: TASK_STATUS,
    @Query('assignedUser') assignedUser: string,
    @Query('createdAt') createdAt: Date,
  ): Promise<AppResponse<Task[]>> {
    try {
      const tasks = await this.taskService.getAllTask(
        status,
        assignedUser,
        createdAt,
      );
      return new AppResponse<Task[]>(TASK_CONSTANT.TASKS_FETCHED_SUCCESS)
        .setStatus(200)
        .setSuccessData(tasks);
    } catch (err) {
      throw err;
    }
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
  async getTaskById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AppResponse<Task>> {
    try {
      const currentUser = req['user'] as IJwtResponse;
      const task = await this.taskService.getTaskById(id, currentUser.id);
      return new AppResponse<Task>(TASK_CONSTANT.TASK_DETAIL_FETCHED_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
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
    status: HttpStatus.NOT_FOUND,
    description: TASK_CONSTANT.TASK_RECORD_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_UPDATE_SUCCESS,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<AppResponse<Task>> {
    try {
      const currentUser = req['user'] as IJwtResponse;

      const task = await this.taskService.updateTask(
        id,
        currentUser.id,
        updateTaskDto,
      );
      return new AppResponse<Task>(TASK_CONSTANT.TASK_UPDATE_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
  }

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change task status.' })
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
    status: HttpStatus.NOT_FOUND,
    description: TASK_CONSTANT.TASK_RECORD_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_STATUS_CHANGED_SUCCESS,
  })
  async changeTaskStatus(
    @Body() taskStatusDto: TaskStatusChangeDto,
    @Param('id') taskId: string,
    @Req() req: Request,
  ): Promise<AppResponse<Task>> {
    try {
      const currentUser = req['user'] as IJwtResponse;
      const task = await this.taskService.changeTaskStatus(
        taskId,
        currentUser.id,
        taskStatusDto,
      );
      return new AppResponse<Task>(TASK_CONSTANT.TASK_STATUS_CHANGED_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
  }

  @Patch('assign/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign user on the task.' })
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
    status: HttpStatus.NOT_FOUND,
    description: TASK_CONSTANT.TASK_RECORD_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: USER_CONSTANT.USER_RECORD_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.USER_ASSIGNED_SUCCESS,
  })
  async assignTaskUser(
    @Body() taskAssignedDto: TaskAssignedUserDto,
    @Param('id') taskId: string,
  ): Promise<AppResponse<Task>> {
    try {
      const task = await this.taskService.assignTaskUser(
        taskId,
        taskAssignedDto,
      );

      return new AppResponse<Task>(TASK_CONSTANT.USER_ASSIGNED_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
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
    status: HttpStatus.NOT_FOUND,
    description: TASK_CONSTANT.TASK_RECORD_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_DELETED_SUCCESS,
  })
  async removeTask(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AppResponse<Task>> {
    try {
      const currentUser = req['user'] as IJwtResponse;
      const task = await this.taskService.removeTask(id, currentUser.id);
      return new AppResponse<Task>(TASK_CONSTANT.TASK_DELETED_SUCCESS)
        .setStatus(200)
        .setSuccessData(task);
    } catch (err) {
      throw err;
    }
  }
}
