import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto, SignupDto, SignupResponseDto } from './dto';
import { AUTH_CONSTANT } from 'src/constant';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Signup user.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: AUTH_CONSTANT.EMAIL_ALREADY_TAKEN,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SignupResponseDto,
    description: AUTH_CONSTANT.USER_SIGNUP_SUCCESS,
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const user = await this.authService.signup(signupDto);

    return res.status(201).json({
      success: true,
      message: AUTH_CONSTANT.USER_SIGNUP_SUCCESS,
      data: user,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AUTH_CONSTANT.INVALID_CREDENTIALS,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginDto,
    description: AUTH_CONSTANT.USER_LOGIN_SUCCESS,
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(loginDto);

    return res.status(200).json({
      success: true,
      message: AUTH_CONSTANT.USER_LOGIN_SUCCESS,
      data: user,
    });
  }
}
