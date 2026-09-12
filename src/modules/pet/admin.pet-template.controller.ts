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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AdminPetService } from './admin.pet-template.service';
import { CreatePetTemplateDto } from './dtos/create.pet-template.dto';
import { UpdatePetTemplateDto } from './dtos/update.pet-template.dto';
import { BulkPetTemplateActionDto } from './dtos/bulk.pet-template.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../auth/guards/admin.auth.guard';
import { AdminRolesGuard } from '../auth/guards/admin.role.guard';
import { Roles } from '../auth/decorators/admin.role.decorator';

@UseGuards(AdminAuthGuard, AdminRolesGuard)
@Roles('admin')
@Controller('admin/pet-templates')
export class AdminPetController {
  constructor(
    private readonly petTemplateService: AdminPetService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
  @UseInterceptors(AnyFilesInterceptor())
  async createPetTemplate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPetTemplateDto: CreatePetTemplateDto,
  ) {
    const avatarFile = files.find(f => f.fieldname === 'avatar');
    if (!avatarFile) {
      throw new BadRequestException('Vui lòng tải lên ảnh avatar cho mẫu pet');
    }

    const uploadTasks: any = [];

    // xử lý avatar
    if (avatarFile) {
      const avatarPromise = this.cloudinaryService
        .uploadFile(avatarFile)
        .then((res) => {
          createPetTemplateDto.avatar = res.secure_url;
        });
      uploadTasks.push(avatarPromise);
    }

    // xử lý các bộ phận
    const rooms = ['livingRoom', 'bedRoom', 'kitchen'];
    const parts = ['body', 'head', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'tail'];

    if (!createPetTemplateDto.rooms) {
      createPetTemplateDto.rooms = {
        livingRoom: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
        bedRoom: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
        kitchen: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
      };
    }

    const roomsObj = createPetTemplateDto.rooms as any;

    for (const room of rooms) {
      if (!roomsObj[room]) {
        roomsObj[room] = { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } };
      }
      if (!roomsObj[room].layers) {
        roomsObj[room].layers = {};
      }
      
      for (const part of parts) {
        const fieldName = `${room}_${part}`;
        const partFile = files.find(f => f.fieldname === fieldName);
        
        if (partFile) {
          const partPromise = this.cloudinaryService
            .uploadFile(partFile)
            .then((res) => {
              if (!roomsObj[room].layers[part]) {
                roomsObj[room].layers[part] = {};
              }
              roomsObj[room].layers[part].url = res.secure_url;
            });
          uploadTasks.push(partPromise);
        }
      }
    }

    try {
      await Promise.all(uploadTasks);
    } catch (error) {
      throw new BadRequestException('Upload ảnh mẫu pet lên Cloudinary thất bại');
    }

    await this.petTemplateService.createPetTemplate(createPetTemplateDto, {
      buffer: avatarFile.buffer,
      mimetype: avatarFile.mimetype,
    });

    return {
      message: 'Tạo mẫu pet thành công',
    };
  }

  @Patch('update/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updatePetTemplate(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updatePetTemplateDto: UpdatePetTemplateDto,
  ) {
    const uploadTasks: any = [];
    const avatarFile = files.find(f => f.fieldname === 'avatar');

    // xử lý avatar (nếu có upload file mới)
    if (avatarFile) {
      const avatarPromise = this.cloudinaryService
        .uploadFile(avatarFile)
        .then((res) => {
          updatePetTemplateDto.avatar = res.secure_url;
        });
      uploadTasks.push(avatarPromise);
    }

    // xử lý các bộ phận
    const rooms = ['livingRoom', 'bedRoom', 'kitchen'];
    const parts = ['body', 'head', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'tail'];

    if (!updatePetTemplateDto.rooms) {
      updatePetTemplateDto.rooms = {
        livingRoom: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
        bedRoom: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
        kitchen: { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } },
      };
    }

    const roomsObj = updatePetTemplateDto.rooms as any;

    for (const room of rooms) {
      if (!roomsObj[room]) {
        roomsObj[room] = { layers: {}, globalZoom: 1, globalOffset: { x: 0, y: 0 } };
      }
      if (!roomsObj[room].layers) {
        roomsObj[room].layers = {};
      }
      
      for (const part of parts) {
        const fieldName = `${room}_${part}`;
        const partFile = files.find(f => f.fieldname === fieldName);
        
        if (partFile) {
          const partPromise = this.cloudinaryService
            .uploadFile(partFile)
            .then((res) => {
              if (!roomsObj[room].layers[part]) {
                roomsObj[room].layers[part] = {};
              }
              roomsObj[room].layers[part].url = res.secure_url;
            });
          uploadTasks.push(partPromise);
        }
      }
    }

    try {
      await Promise.all(uploadTasks);
    } catch (error) {
      throw new BadRequestException('Upload ảnh cập nhật mẫu pet lên Cloudinary thất bại');
    }

    await this.petTemplateService.updatePetTemplate(
      id,
      updatePetTemplateDto,
      avatarFile
        ? {
          buffer: avatarFile.buffer,
          mimetype: avatarFile.mimetype,
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
