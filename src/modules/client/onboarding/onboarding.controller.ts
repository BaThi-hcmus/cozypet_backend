import { Body, ConflictException, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreatePetDto } from './dtos/create.pet.dto';
import type { Request } from 'express'; // dùng lấy cookie
// dùng bắt file ảnh
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('pet')
  @UseInterceptors(FileInterceptor('avatar'))
  async createInitialPet(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,  // lấy toàn bộ request object
    @Body() createPetDto: CreatePetDto
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        createPetDto.avatar = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh pet thất bại');
      }
    }

    const guestId = req.cookies?.guest_id;

    if (!guestId) {
      throw new ConflictException('Không tìm thấy guest id trong cookie');
    }

    await this.onboardingService.createInitialPet(guestId, createPetDto);
    return {
      message: 'Tạo pet thành công'
    }
  }
}
