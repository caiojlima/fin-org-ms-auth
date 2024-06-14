import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma, User } from "@prisma/client";
import { AuthService } from "./auth.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private authService: AuthService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    console.log(user);
    

    if(!user) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const isEmailInUse = await this.prisma.user.findUnique({ where: {email: data.email} });
    if (isEmailInUse) throw new HttpException("Email already in use!", HttpStatus.BAD_REQUEST)
    data.password = await this.authService.encryptPass(data.password);
    return this.prisma.user.create({
      data,
    });
  }

}