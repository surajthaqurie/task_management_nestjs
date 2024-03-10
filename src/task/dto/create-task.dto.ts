import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
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
  description?: string;
}
