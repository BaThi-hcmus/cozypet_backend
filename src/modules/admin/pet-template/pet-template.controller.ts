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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetTemplateService } from './pet-template.service';
import { CreatePetTemplateDto } from './dtos/create.pet-template.dto';
import { UpdatePetTemplateDto } from './dtos/update.pet-template.dto';
import { BulkPetTemplateActionDto } from './dtos/bulk.pet-template.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Controller('admin/pet-templates')
export class PetTemplateController {
  constructor(
    private readonly petTemplateService: PetTemplateService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAll(
    @Query('status') status: string,
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('sortType') sortType: string,
  ) {
    const result = await this.petTemplateService.getAll(
      status,
      keyword,
      page,
      sortType,
    );
    return {
      ...result,
      message: 'Lấy danh sách mẫu pet thành công',
    };
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  async createPetTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPetTemplateDto: CreatePetTemplateDto,
  ) {
    if (!file) {
      throw new BadRequestException('Ảnh avatar không được để trống');
    }

    try {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      createPetTemplateDto.avatar = uploadResult.secure_url;
    } catch (error) {
      throw new BadRequestException('Upload ảnh avatar mẫu pet lên Cloudinary thất bại');
    }

    await this.petTemplateService.createPetTemplate(createPetTemplateDto, {
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    return {
      message: 'Tạo mẫu pet thành công',
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updatePetTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updatePetTemplateDto: UpdatePetTemplateDto,
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        updatePetTemplateDto.avatar = uploadResult.secure_url;
      } catch (error) {
        throw new BadRequestException('Upload ảnh avatar mẫu pet lên Cloudinary thất bại');
      }
    }

    await this.petTemplateService.updatePetTemplate(
      id,
      updatePetTemplateDto,
      file
        ? {
            buffer: file.buffer,
            mimetype: file.mimetype,
          }
        : undefined,
    );

    return {
      message: 'Cập nhật mẫu pet thành công',
    };
  }

  @Get('detail/:id')
  async getDetailPetTemplate(@Param('id') id: string) {
    const result = await this.petTemplateService.detailPetTemplate(id);
    return {
      data: result,
      message: 'Lấy thông tin chi tiết mẫu pet thành công',
    };
  }

  @Patch('delete/:id')
  async deletePetTemplate(@Param('id') id: string) {
    await this.petTemplateService.deletePetTemplate(id);
    return {
      message: 'Xóa mẫu pet thành công',
    };
  }

  @Patch('bulk-actions')
  async bulkPetTemplate(@Body() bulkPetTemplateActionDto: BulkPetTemplateActionDto) {
    await this.petTemplateService.bulkPetTemplate(bulkPetTemplateActionDto);
    return {
      message: 'Đã cập nhật thành công các bản ghi mẫu pet',
    };
  }
}
