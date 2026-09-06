import { Controller, Get } from '@nestjs/common';
import { ClientRoomService } from './client.room.service';

@Controller('room')
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
}
