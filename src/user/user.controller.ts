import { Controller, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { USER_CONSTANT } from 'src/constant';
import { UserResponseDto } from './dto';
import { COMMON_ERROR } from 'src/constant/common.constant';
import { IJwtResponse } from 'src/auth/interface';
import { AppResponse } from 'src/utils';
import { getUser } from 'src/auth/decorators';
import { IUser } from './interfaces';

@ApiTags('User')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all users.',
        description: 'Authenticated user can get all user list'
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        isArray: true,
        description: USER_CONSTANT.USERS_FETCHED_SUCCESS
    })
    async getUsers(): Promise<AppResponse<IUser[]>> {
        const users = await this.userService.getUsers();

        return new AppResponse<IUser[]>(USER_CONSTANT.USERS_FETCHED_SUCCESS).setStatus(200).setSuccessData(users);
    }

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get user profile.',
        description: 'Authenticated user get their profile'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COMMON_ERROR.UNAUTHORIZED
    })
    @ApiBearerAuth()
    async getUserById(@getUser() currentUser: IJwtResponse): Promise<AppResponse<IUser | null>> {
        const user = await this.userService.getUserById(currentUser.id);
        return new AppResponse<IUser | null>(USER_CONSTANT.USER_PROFILE_FETCHED_SUCCESS).setStatus(200).setSuccessData(user);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete user.',
        description: 'Authenticated user can delete their account'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: USER_CONSTANT.USER_DELETED_SUCCESS
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COMMON_ERROR.UNAUTHORIZED
    })
    @ApiBearerAuth()
    async deleteUser(@getUser() currentUser: IJwtResponse): Promise<AppResponse<IUser | null>> {
        const user = await this.userService.deleteUser(currentUser.id);

        return new AppResponse<IUser | null>(USER_CONSTANT.USER_DELETED_SUCCESS).setStatus(200).setSuccessData(user);
    }
}
