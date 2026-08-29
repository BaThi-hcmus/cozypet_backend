import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dtos/create.item.dto';
import { UpdateItemDto } from './dtos/update.item.dto';
import { BulkItemActionDto } from './dtos/bulk.item.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Get()
  async getAll(
    @Query('status') status: string,
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('sortType') sortType: string,
  ) {
    const result = await this.itemService.getAll(status, keyword, page, sortType);
    return {
      ...result,
      message: 'Lấy danh sách vật phẩm thành công',
    };
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto,
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        createItemDto.image = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh vật phẩm lên Cloudinary thất bại');
      }
    }

    await this.itemService.createItem(createItemDto);
    return {
      message: 'Tạo vật phẩm thành công',
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateItem(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        updateItemDto.image = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh vật phẩm lên Cloudinary thất bại');
      }
    }

    await this.itemService.updateItem(id, updateItemDto);
    return {
      message: 'Cập nhật vật phẩm thành công',
    };
  }

  @Get('detail/:id')
  async getDetailItem(@Param('id') id: string) {
    const result = await this.itemService.detailItem(id);
    return {
      data: result,
      message: 'Lấy thông tin chi tiết vật phẩm thành công',
    };
  }

  @Patch('delete/:id')
  async deleteItem(@Param('id') id: string) {
    await this.itemService.deleteItem(id);
    return {
      message: 'Xóa vật phẩm thành công',
    };
  }

  @Patch('bulk-actions')
  async bulkItem(@Body() bulkItemActionDto: BulkItemActionDto) {
    await this.itemService.bulkItem(bulkItemActionDto);
    return {
      message: 'Đã cập nhật thành công các bản ghi vật phẩm',
    };
  }
}
