import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { TASK_STATUS } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'New',
    description: 'Status of the task',
    format: 'string',
    enum: TASK_STATUS,
  })
  @IsNotEmpty()
  @IsString()
  status: TASK_STATUS;

  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for user who is assign on the task',
    format: 'string',
  })
  @Optional()
  @IsString()
  assignUser: string;
}

export class TaskResponseDto extends UpdateTaskDto {
  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for the task',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for user who create the task',
    format: 'string',
  })
  createdUser: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created date/time of task',
    format: 'date',
  })
  readonly createAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated date/time of task',
    format: 'date',
  })
  readonly updatedAt: Date;
}

export class TaskStatusChangeDto {
  @ApiProperty({
    example: 'New',
    description: 'Status of the task',
    format: 'string',
    enum: TASK_STATUS,
  })
  @IsNotEmpty()
  @IsString()
  status: TASK_STATUS;
}
