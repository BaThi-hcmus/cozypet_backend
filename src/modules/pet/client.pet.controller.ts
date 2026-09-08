import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, Param, Get, Patch, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ClientPetService } from './client.pet.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePetDto } from './dtos/update.pet.dto';
import { AccessTokenGuard } from '../auth/guards/client.access-token.guard';
import type { Request } from 'express';

@Controller('pets')
export class ClientPetController {
  constructor(private readonly petService: ClientPetService) { }

  @Post('guest-reveal')
  @UseInterceptors(FileInterceptor('image'))
  async summonPetForGuest(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng cung cấp ảnh pet');
    }

    const petTemplate = await this.petService.summonPetForGuest(file);

    return {
      data: petTemplate,
      message: 'Chọn pet template thành công'
    }
  }

  @Post('user-reveal')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async summonPetForUser(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng cung cấp ảnh pet');
    }

    // lấy userId từ request
    const userId = req['user'].sub;
    if (!userId) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    const data = await this.petService.summonPetForUser(userId, file);

    return {
      ...data,
      message: 'Triệu hồi pet thành công'
    }
  }

  @Get('my-current-pet')
  @UseGuards(AccessTokenGuard)
  async getMyPet(
    @Req() req: Request
  ) {
    const userId = req['user'].sub;
    if (!userId) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
    }

    const data = await this.petService.getMyCurrentPet(userId);

    return {
      ...data,
      message: 'Lấy thông tin pet thành công'
    }
  }

  @Patch('update/:petId')
  @UseGuards(AccessTokenGuard)
  async updatePet(
    @Param('petId') petId: string,
    @Body() updatePetDto: UpdatePetDto
  ) {
    if (!petId) {
      throw new BadRequestException('Vui lòng cung cấp id pet');
    }

    const data = await this.petService.updatePet(petId, updatePetDto);

    return {
      ...data,
      message: 'Cập nhật pet thành công'
    }
  }
}
