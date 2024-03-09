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
    example: new Date(),
    description: 'Created date/time of User',
    format: 'date',
  })
  @IsString()
  readonly createAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated date/time of User',
    format: 'date',
  })
  @IsString()
  @MinLength(6)
  readonly updatedAt: Date;
}
