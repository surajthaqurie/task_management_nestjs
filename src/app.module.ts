import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
// import { APP_FILTER } from '@nestjs/core';
// import { HttpExceptionFilter } from './filters';

@Module({
  imports: [AuthModule, UserModule, TaskModule],
  controllers: [],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
