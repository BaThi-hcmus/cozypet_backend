import { Controller, Post, Body, Res, Req, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { ClientAuthService } from "./client.auth.service";
import type { Request, Response } from "express";
import { LoginDto } from "./dtos/login.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { Model } from "mongoose";

@Controller('auth')
export class ClientAuthController {
  constructor(
    private readonly authService: ClientAuthService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) { }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.register(registerDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Chống XSS 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      message: 'Đăng ký thành công'
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Chống XSS 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      message: 'Đăng nhập thành công'
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request
  ) {
    const token = req.cookies['refreshToken'];
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy refresh token trong cookie');
    }

    const accessToken = await this.authService.refreshToken(token);

    return accessToken;
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = req.cookies['refreshToken'];
    if (token) {
      await this.userModel.updateOne(
        { refreshToken: token },
        {
          $unset: {
            refreshToken: 1,
            refreshTokenExpiresAt: 1,
          },
        }
      );
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
    });

    return { message: 'Đăng xuất thành công' };
  }
}