import { Controller, Param, Post, Body, Res, Query, Get, Req, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { LoginDto } from './dtos/login.dto';
import express from 'express';
import { AdminAuthGuard } from './guards/admin.auth.guard';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) { }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response
  ) {
    const sessionId = await this.authService.login(loginDto);

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    return {
      message: 'Đăng nhập thành công',
    }
  }

  @UseGuards(AdminAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return {
      data: req.info,
      message: 'Lấy thông tin tài khoản thành công'
    }
  }

  @UseGuards(AdminAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response
  ) {
    await this.authService.logout(req.req.info._id);

    res.clearCookie('sessionId', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });

    return {
      message: 'Logout thành công'
    }
  }
}
