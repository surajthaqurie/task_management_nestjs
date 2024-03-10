import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'Micky mouse',
    description: 'Full name of user',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'micky@yomail.com',
    description: 'email address of user',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class SignupDto extends AuthDto {
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The password of the User',
    format: 'string',
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class SignupResponseDto extends AuthDto {
  @ApiProperty({
    example: '7c6cef4c-3c86-4ea2-a2ee-af9e990e3e7b',
    description: 'Id for the user',
    format: 'string',
  })
  id: string;

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
