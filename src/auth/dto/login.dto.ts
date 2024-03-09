import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'micky@yomail.com',
    description: 'email address of user',
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
  @IsString()
  readonly password: string;
}
