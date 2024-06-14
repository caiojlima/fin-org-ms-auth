import { Module } from '@nestjs/common';
import { UserController } from '../Controllers/auth.controller';
import { UserService } from '../Services/user.service';
import { PrismaService } from '../Services/prisma.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
