import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientPetService } from './client.pet.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pet')
export class ClientPetController {
  constructor(private readonly petService: ClientPetService) { }

  @Post('reveal')
  @UseInterceptors(FileInterceptor('image'))
  async summonPetForUser(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng cung cấp ảnh pet');
    }

    const petTemplate = await this.petService.summonPetForUser(file);

    return {
      data: petTemplate,
      message: 'Chọn pet template thành công'
    }
  }
}
