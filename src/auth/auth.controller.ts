import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  LoginResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dto';
import { AUTH_CONSTANT } from 'src/constant';
import { AppResponse } from 'src/utils';

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
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<AppResponse<SignupResponseDto>> {
    try {
      const user = await this.authService.signup(signupDto);
      return new AppResponse<SignupResponseDto>(
        AUTH_CONSTANT.USER_SIGNUP_SUCCESS,
      )
        .setStatus(201)
        .setSuccessData(user);
    } catch (err) {
      throw err;
    }
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
    type: LoginResponseDto,
    description: AUTH_CONSTANT.USER_LOGIN_SUCCESS,
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<AppResponse<LoginResponseDto>> {
    try {
      const user = await this.authService.login(loginDto);
      return new AppResponse<LoginResponseDto>(AUTH_CONSTANT.USER_LOGIN_SUCCESS)
        .setStatus(201)
        .setSuccessData(user);
    } catch (err) {
      throw err;
    }
  }
}
