import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() res: Response) {
    const users = await this.userService.getUsers();

    return res.status(200).json({
      success: true,
      message: 'Users fetched Successfully',
      data: users,
    });
  }

  @Get(':id')
  async getUserById(@Res() res: Response, @Param('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    return res.status(200).json({
      success: true,
      message: 'User data get Successfully',
      data: user,
    });
  }

  @Delete(':id')
  async deleteUser(@Res() res: Response, @Param('id') userId: string) {
    const user = await this.userService.deleteUser(userId);
    return res.status(200).json({
      success: true,
      message: 'User deleted Successfully',
      data: user,
    });
  }
}
