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

    console.log('Setting cookie with sessionId:', sessionId);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    res.cookie('sessionId', sessionId, {
      httpOnly: true, // chống tấn công XSS
      sameSite: 'lax', // 'lax' cho phép cookie gửi kèm trong cùng origin (localhost)
      secure: false, // false cho môi trường dev (HTTP), nếu set là true thì chỉ gửi được bằng HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      path: '/' // gửi kèm cookie ở toàn bộ đường dẫn
    })

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
}
