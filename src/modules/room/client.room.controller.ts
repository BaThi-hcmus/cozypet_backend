import { Controller, Get } from '@nestjs/common';
import { ClientRoomService } from './client.room.service';

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
}
