import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
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
  async getUsers(@Res() res: Response) {
    const users = await this.userService.getUsers();

    return res.status(200).json({
      success: true,
      message: USER_CONSTANT.USERS_FETCHED_SUCCESS,
      data: users,
    });
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
  async getUserById(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];

    return res.status(200).json({
      success: true,
      message: USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS,
      data: user,
    });
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
  async deleteUser(@Res() res: Response, @Param('id') userId: string) {
    const user = await this.userService.deleteUser(userId);
    return res.status(200).json({
      success: true,
      message: USER_CONSTANT.USER_DELETED_SUCCESS,
      data: user,
    });
  }
}
