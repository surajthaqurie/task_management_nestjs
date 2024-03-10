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
import { Request, Response } from 'express';
import { COMMON_ERROR, TASK_CONSTANT } from 'src/constant';

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
    @Res() res: Response,
  ) {
    const task = await this.taskService.createTask(createTaskDto, req);
    return res.status(201).json({
      success: true,
      message: TASK_CONSTANT.TASK_CREATED_SUCCESS,
      data: task,
    });
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
  async getAllTask(@Res() res: Response) {
    const tasks = await this.taskService.getAllTask();
    return res.status(200).json({
      success: true,
      message: TASK_CONSTANT.TASKS_FETCHED_SUCCESS,
      data: tasks,
    });
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
  async getTaskById(@Res() res: Response, @Param('id') id: string) {
    const task = await this.taskService.getTaskById(id);
    return res.status(200).json({
      success: true,
      message: TASK_CONSTANT.TASK_DETAIL_FETCHED_SUCCESS,
      data: task,
    });
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
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.taskService.updateTask(id, updateTaskDto);
    return res.status(200).json({
      success: true,
      message: TASK_CONSTANT.TASK_UPDATE_SUCCESS,
      data: task,
    });
  }

  @Patch('status/:id')
  async changeTaskStatus(
    @Body() taskStatusDto: TaskStatusChangeDto,
    @Res() res: Response,
    @Param('id') taskId: string,
  ) {
    const task = await this.taskService.changeTaskStatus(taskId, taskStatusDto);
    return res.status(200).json({
      success: true,
      message: TASK_CONSTANT.TASK_STATUS_CHANGED_SUCCESS,
      data: task,
    });
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
  async removeTask(@Res() res: Response, @Param('id') id: string) {
    const task = await this.taskService.removeTask(id);
    return res.status(200).json({
      success: true,
      message: TASK_CONSTANT.TASK_DELETED_SUCCESS,
      data: task,
    });
  }
}
