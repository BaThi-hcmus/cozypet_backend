import { Controller, Get, Param, Post, Req, Body, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ClientRoomService } from './client.room.service';
import type { Request } from 'express';
import { ReplaceItemDto } from './dtos/client.replace-item.dto';
import { AccessTokenGuard } from '../auth/guards/client.access-token.guard';

@Controller('rooms')
export class ClientRoomController {
  constructor(
    private readonly roomService: ClientRoomService
  ) { }

  @Get('default')
  async getRoomDefault() {
    const data = await this.roomService.getRoomDefault();
    return {
      data: data,
      message: 'Lấy room mặc định và các item mặc định thành công'
    }
  }

  @Get()
  async getAllRooms() {
    const data = await this.roomService.getAllRooms();

    return {
      data,
      message: 'Lấy danh sách toàn bộ room trong hệ thống thành công'
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post(':userRoomId/replace-item')
  async replaceItemInRoom(
    @Req() req: Request,
    @Param('userRoomId') userRoomId: string,
    @Body() replaceItemDto: ReplaceItemDto
  ) {
    const userId = req['user'].sub;
    if (userId) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
    }

    if (!userRoomId) {
      throw new BadRequestException('Thiếu user room id');
    }

    await this.replaceItemInRoom(userId, userRoomId, replaceItemDto);

    return {
      message: 'Cập nhật vật phẩm thành công'
    }
  }
}
