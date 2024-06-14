import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma, User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

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

  async signIn(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new HttpException("Email not found!", HttpStatus.NOT_FOUND);

    const isPasswordValid = await this.authService.compareHash(password, user.password);

    if (!isPasswordValid) throw new HttpException("Wrong password!", HttpStatus.UNAUTHORIZED);

    const payload = { sub: user.id, email: user.email, name: user.name, lastName: user.lastName };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}