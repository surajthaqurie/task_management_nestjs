import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
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
import { getUser } from 'src/auth/decorators';

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
    try {
      const users = await this.userService.getUsers();

      return new AppResponse<UserResponseDto[]>(
        USER_CONSTANT.USERS_FETCHED_SUCCESS,
      )
        .setStatus(200)
        .setSuccessData(users);
    } catch (err) {
      throw new BadRequestException(err);
    }
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
    @getUser() currentUser: IJwtResponse,
  ): Promise<AppResponse<UserResponseDto | null>> {
    try {
      const user = await this.userService.getUserById(currentUser.id);
      return new AppResponse<UserResponseDto | null>(
        USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS,
      )
        .setStatus(200)
        .setSuccessData(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
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
    try {
      const user = await this.userService.deleteUser(userId);

      return new AppResponse<UserResponseDto | null>(
        USER_CONSTANT.USER_DELETED_SUCCESS,
      )
        .setStatus(200)
        .setSuccessData(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
