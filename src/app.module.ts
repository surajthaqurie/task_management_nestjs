import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [AuthModule, UserModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
