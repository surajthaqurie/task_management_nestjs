import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { USER_CONSTANT } from 'src/constant';
import { UserResponseDto } from './dto';
import { COMMON_ERROR } from 'src/constant/common.constant';
import { IJwtResponse } from 'src/auth/interface';
import { AppResponse } from 'src/utils';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    isArray: true,
    description: USER_CONSTANT.USERS_FETCHED_SUCCESS,
  })
  async getUsers(): Promise<AppResponse<UserResponseDto[]>> {
    const users = await this.userService.getUsers();

    return new AppResponse<UserResponseDto[]>(
      USER_CONSTANT.USERS_FETCHED_SUCCESS,
    )
      .setStatus(200)
      .setSuccessData(users);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  async getUserById(
    @Req() req: Request,
  ): Promise<AppResponse<UserResponseDto | null>> {
    const currentUser = req['user'] as IJwtResponse;

    const user = await this.userService.getUserById(currentUser.id);
    return new AppResponse<UserResponseDto | null>(
      USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS,
    )
      .setStatus(200)
      .setSuccessData(user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: USER_CONSTANT.USER_DELETED_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: COMMON_ERROR.UNAUTHORIZED,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'The token we need for auth',
  })
  async deleteUser(
    @Param('id') userId: string,
  ): Promise<AppResponse<UserResponseDto | null>> {
    const user = await this.userService.deleteUser(userId);

    return new AppResponse<UserResponseDto | null>(
      USER_CONSTANT.USER_DELETED_SUCCESS,
    )
      .setStatus(200)
      .setSuccessData(user);
  }
}
