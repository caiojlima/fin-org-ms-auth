import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../Services/user.service';
import { User } from "@prisma/client";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user/:id")
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.user({ id: Number(id) });
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name: string, email: string, lastName: string, password: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post('signIn')
  async signinUser(
    @Body() userData: { email: string, password: string },
  ): Promise<{ token: string }> {
    return this.userService.signIn(userData.email, userData.password);
  }
}
