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
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'body', maxCount: 1 },
    { name: 'head', maxCount: 1 },
    { name: 'leftArm', maxCount: 1 },
    { name: 'rightArm', maxCount: 1 },
    { name: 'leftLeg', maxCount: 1 },
    { name: 'rightLeg', maxCount: 1 },
    { name: 'tail', maxCount: 1 },
  ]))
  async createPetTemplate(
    @UploadedFiles() files: {
      avatar?: Express.Multer.File[];
      body?: Express.Multer.File[];
      head?: Express.Multer.File[];
      leftArm?: Express.Multer.File[];
      rightArm?: Express.Multer.File[];
      leftLeg?: Express.Multer.File[];
      rightLeg?: Express.Multer.File[];
      tail?: Express.Multer.File[];
    },
    @Body() createPetTemplateDto: CreatePetTemplateDto,
  ) {
    if (!files.avatar?.[0]) {
      throw new BadRequestException('Vui lòng tải lên ảnh avatar cho mẫu pet');
    }

    const uploadTasks: any = [];

    // xử lý avatar
    if (files.avatar && files.avatar[0]) {
      const avatarPromise = this.cloudinaryService
        .uploadFile(files.avatar[0])
        .then((res) => {
          createPetTemplateDto.avatar = res.secure_url;
        });
      uploadTasks.push(avatarPromise);
    }

    // xử lý các bộ phận
    const parts = ['body', 'head', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'tail'];

    // Đảm bảo layers object tồn tại
    if (!createPetTemplateDto.layers) {
      createPetTemplateDto.layers = {};
    }
    const layers = createPetTemplateDto.layers;

    for (const part of parts) {
      if (files[part] && files[part][0]) {
        const partPromise = this.cloudinaryService
          .uploadFile(files[part][0])
          .then((res) => {
            if (!layers[part]) {
              layers[part] = {};
            }
            layers[part].url = res.secure_url;
          })
        uploadTasks.push(partPromise);
      }
    }

    try {
      await Promise.all(uploadTasks);
    } catch (error) {
      throw new BadRequestException('Upload ảnh mẫu pet lên Cloudinary thất bại');
    }

    await this.petTemplateService.createPetTemplate(createPetTemplateDto, {
      buffer: files.avatar[0].buffer,
      mimetype: files.avatar[0].mimetype,
    });

    return {
      message: 'Tạo mẫu pet thành công',
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'body', maxCount: 1 },
    { name: 'head', maxCount: 1 },
    { name: 'leftArm', maxCount: 1 },
    { name: 'rightArm', maxCount: 1 },
    { name: 'leftLeg', maxCount: 1 },
    { name: 'rightLeg', maxCount: 1 },
    { name: 'tail', maxCount: 1 },
  ]))
  async updatePetTemplate(
    @UploadedFiles() files: {
      avatar?: Express.Multer.File[];
      body?: Express.Multer.File[];
      head?: Express.Multer.File[];
      leftArm?: Express.Multer.File[];
      rightArm?: Express.Multer.File[];
      leftLeg?: Express.Multer.File[];
      rightLeg?: Express.Multer.File[];
      tail?: Express.Multer.File[];
    },
    @Param('id') id: string,
    @Body() updatePetTemplateDto: UpdatePetTemplateDto,
  ) {
    const uploadTasks: any = [];

    // xử lý avatar (nếu có upload file mới)
    if (files?.avatar && files?.avatar?.[0]) {
      const avatarPromise = this.cloudinaryService
        .uploadFile(files.avatar[0])
        .then((res) => {
          updatePetTemplateDto.avatar = res.secure_url;
        });
      uploadTasks.push(avatarPromise);
    }

    // xử lý các bộ phận
    const parts = ['body', 'head', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'tail'];

    // Đảm bảo layers object tồn tại
    if (!updatePetTemplateDto.layers) {
      updatePetTemplateDto.layers = {};
    }
    const layers = updatePetTemplateDto.layers;

    // upload các bộ phận (nếu admin có upload file mới)
    for (const part of parts) {
      if (files?.[part] && files?.[part]?.[0]) {
        const partPromise = this.cloudinaryService
          .uploadFile(files[part][0])
          .then((res) => {
            if (!layers[part]) {
              layers[part] = {};
            }
            layers[part].url = res.secure_url;
          })
        uploadTasks.push(partPromise);
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
      files?.avatar?.[0]
        ? {
          buffer: files.avatar[0].buffer,
          mimetype: files.avatar[0].mimetype,
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
