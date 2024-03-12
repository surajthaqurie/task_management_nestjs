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
import { COMMON_ERROR, TASK_CONSTANT, USER_CONSTANT } from 'src/constant';
import { AppResponse } from 'src/utils';
import { TASK_STATUS, Task } from '@prisma/client';
import { IJwtResponse } from 'src/auth/interface';
import { getUser } from 'src/auth/decorators';

@ApiTags('Task')
@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Task.',
    description: 'Authenticated user can create a task',
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
    status: HttpStatus.CREATED,
    type: TaskResponseDto,
    description: TASK_CONSTANT.TASK_CREATED_SUCCESS,
  })
  async createTask(
    @getUser() currentUser: IJwtResponse,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.createTask(
      createTaskDto,
      currentUser.id,
    );
    return new AppResponse<Task>(TASK_CONSTANT.TASK_CREATED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all task.',
    description: 'Authenticated user get all task',
  })
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
    let query = {};
    if (status) query = { ...query, status };
    if (assignedUser) query = { ...query, assignedUser };
    if (createdAt) query = { ...query, createdAt };

    const tasks = await this.taskService.getAllTask(query);
    return new AppResponse<Task[]>(TASK_CONSTANT.TASKS_FETCHED_SUCCESS)
      .setStatus(200)
      .setSuccessData(tasks);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get task details by Id.',
    description: 'Authenticated user get task details',
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
  @ApiOperation({
    summary: 'Update task.',
    description:
      'Assigned user can update their task and any authenticated user can update a non-assigned task.',
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
    status: HttpStatus.FORBIDDEN,
    description: TASK_CONSTANT.FORBIDDEN_UPDATE_TASK,
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
    @getUser() currentUser: IJwtResponse,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.updateTask(
      id,
      currentUser.id,
      updateTaskDto,
    );
    return new AppResponse<Task>(TASK_CONSTANT.TASK_UPDATE_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change task status.',
    description:
      'The status of an assigned task can be change by the assigned user, and the status of a non-assigned task can be modified by any authenticated user.',
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
    status: HttpStatus.FORBIDDEN,
    description: TASK_CONSTANT.FORBIDDEN_STATUS_CHANGE_TASK,
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
    @getUser() currentUser: IJwtResponse,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.changeTaskStatus(
      taskId,
      currentUser.id,
      taskStatusDto,
    );
    return new AppResponse<Task>(TASK_CONSTANT.TASK_STATUS_CHANGED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Patch('assign/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Assign user on the task.',
    description:
      'The user who is currently allocated can assign tasks to other users, and any authenticated user can assign non-assigned tasks.',
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
    status: HttpStatus.FORBIDDEN,
    description: TASK_CONSTANT.FORBIDDEN_ASSIGN_TASK,
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
    const task = await this.taskService.assignTaskUser(taskId, taskAssignedDto);

    return new AppResponse<Task>(TASK_CONSTANT.USER_ASSIGNED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove task.',
    description:
      'Assigned task can be deleted by only that assigned user or non assigned task can be delete by any authentication user',
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
    status: HttpStatus.FORBIDDEN,
    description: TASK_CONSTANT.FORBIDDEN_DELETE_TASK,
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
    @getUser() currentUser: IJwtResponse,
  ): Promise<AppResponse<Task>> {
    const task = await this.taskService.removeTask(id, currentUser.id);
    return new AppResponse<Task>(TASK_CONSTANT.TASK_DELETED_SUCCESS)
      .setStatus(200)
      .setSuccessData(task);
  }
}
