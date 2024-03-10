import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'micky@yomail.com',
    description: 'Email address of user',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The password of the User',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for the user',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    example: 'micky@yomail.com',
    description: 'Email address of user',
    format: 'string',
  })
  email: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YzZjZWY0Yy0zYzg2LTRlYTItYTJlZS1hZjllOTkwZTNlN2IiLCJpYXQiOjE3MTAwMDU5NzAsImV4cCI6MTcxMDA2NTk3MH0.uPYwgloP44022xo-_xCzwiy-0tUR684JuafhkECErhI',
    description: 'Access token of user',
    format: 'string',
  })
  accessToken: string;
}
