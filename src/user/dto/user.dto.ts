import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for the user',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    example: 'Micky mouse',
    description: 'Full name of user',
    format: 'string',
  })
  fullName: string;

  @ApiProperty({
    example: 'micky@yomail.com',
    description: 'Email address of user',
    format: 'string',
  })
  email: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created date/time of User',
    format: 'date',
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated date/time of User',
    format: 'date',
  })
  readonly updatedAt: Date;
}
