import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminRoomService } from './admin.room.service';
import { CreateRoomDto } from './dtos/create.room.dto';
import { UpdateRoomDto } from './dtos/update.room.dto';
import { BulkRoomActionDto } from './dtos/bulk.room.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../auth/guards/admin.auth.guard';
import { AdminRolesGuard } from '../auth/guards/admin.role.guard';
import { Roles } from '../auth/decorators/admin.role.decorator';

@UseGuards(AdminAuthGuard, AdminRolesGuard)
@Roles('admin')
@Controller('admin/rooms')
export class AdminRoomController {
  constructor(
    private readonly roomService: AdminRoomService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Get()
  async getAll(
    @Query('status') status: string,
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('sortType') sortType: string,
  ) {
    const result = await this.roomService.getAll(status, keyword, page, sortType);
    return {
      ...result,
      message: 'Lấy danh sách phòng thành công',
    };
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('background_url'))
  async createRoom(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        createRoomDto.background_url = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh nền phòng lên Cloudinary thất bại');
      }
    }

    if (typeof createRoomDto.slots === 'string') {
      try {
        createRoomDto.slots = JSON.parse(createRoomDto.slots);
      } catch (error) {
        throw new BadRequestException('Trường slots phải là định dạng JSON hợp lệ');
      }
    }

    await this.roomService.createRoom(createRoomDto);
    return {
      message: 'Tạo phòng thành công',
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('background_url'))
  async updateRoom(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        updateRoomDto.background_url = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh nền phòng lên Cloudinary thất bại');
      }
    }

    if (typeof updateRoomDto.slots === 'string') {
      try {
        updateRoomDto.slots = JSON.parse(updateRoomDto.slots);
      } catch (error) {
        throw new BadRequestException('Trường slots phải là định dạng JSON hợp lệ');
      }
    }
    console.log(updateRoomDto);

    await this.roomService.updateRoom(id, updateRoomDto);
    return {
      message: 'Cập nhật phòng thành công',
    };
  }

  @Get('detail/:id')
  async getDetailRoom(@Param('id') id: string) {
    const result = await this.roomService.detailRoom(id);
    return {
      data: result,
      message: 'Lấy thông tin chi tiết phòng thành công',
    };
  }

  @Patch('delete/:id')
  async deleteRoom(@Param('id') id: string) {
    await this.roomService.deleteRoom(id);
    return {
      message: 'Xóa phòng thành công',
    };
  }

  @Patch('bulk-actions')
  async bulkRoom(@Body() bulkRoomActionDto: BulkRoomActionDto) {
    await this.roomService.bulkRoom(bulkRoomActionDto);
    return {
      message: 'Đã cập nhật thành công các bản ghi phòng',
    };
  }

  @Get(':roomCode')
  async getRoomByCode(
    @Param('roomCode') roomCode: string
  ) {
    if (!roomCode) {
      throw new BadRequestException('room code không tồn tại');
    }

    const data = await this.roomService.getRoomByCode(roomCode);

    return {
      data,
      message: 'Lấy thông tin room và item default thành công'
    }
  }
}
