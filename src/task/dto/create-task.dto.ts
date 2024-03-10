import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUS } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({
    example: 'Task one',
    description: 'Title of the task',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This task implement the task created',
    description: 'Description of the task',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateTaskDto extends TaskDto {
  @ApiProperty({
    example: 'New',
    description: 'Status of the task',
    format: 'string',
    enum: TASK_STATUS,
  })
  @IsOptional()
  @IsString()
  status: TASK_STATUS;

  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for user who is assign on the task',
    format: 'string',
  })
  @IsOptional()
  @IsString()
  assignUser: string;
}
