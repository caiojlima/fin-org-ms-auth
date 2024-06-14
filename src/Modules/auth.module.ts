import { Module } from '@nestjs/common';
import { UserController } from '../Controllers/auth.controller';
import { UserService } from '../Services/user.service';
import { PrismaService } from '../Services/prisma.service';
import { AuthService } from 'src/Services/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' }
    })
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService],
})
export class AppModule {}
