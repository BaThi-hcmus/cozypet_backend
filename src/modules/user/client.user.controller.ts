import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClientUserService } from './client.user.service';
import type { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/client.access-token.guard';

@Controller('user')
export class ClientUserController {
  constructor(
    private readonly userService: ClientUserService
  ) { }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userPayload = req['user'];
    const user = await this.userService.getProfile(userPayload.sub);

    return {
      data: user,
      message: 'Lấy thông tin user thành công'
    }
  }
}
