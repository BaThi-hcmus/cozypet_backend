import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create.account.dto';
import { UpdateAccountDto } from './dtos/update.account.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly cloudinaryService: CloudinaryService
  ) { };

  @Get()
  async getAll(@Query('status') status: string, @Query('keyword') keyword: string, @Query('page') page: string, @Query('sortType') sortType: string) {
    const result = await this.accountService.getAll(status, keyword, page, sortType);
    return {
      ...result,
      message: 'Lấy danh sách tài khoản thành công'
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar')) // có nhiệm vụ bắt File ảnh từ frontend gửi qua
  async createAccount(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAccountDto: CreateAccountDto
  ) {
    if (file) {
      try {
        // đẩy file lên cloudinary
        const uploadResult = await this.cloudinaryService.uploadFile(file);

        // Lấy đường dẫn
        createAccountDto.avatar = uploadResult.secure_url;
      } catch (error) {
        throw new Error('Upload ảnh lên cloud thất bại');
      }
    }

    await this.accountService.createAccount(createAccountDto);
    return {
      message: 'Tạo tài khoản thành công'
    }
  }

  @Patch('update/:id')
  async updateAccount(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    await this.accountService.updateAccount(id, updateAccountDto);
    return {
      message: 'Cập nhật tài khoản thành công'
    }
  }

  @Get('detail/:id')
  async getDetailAccount(@Param('id') id: string) {
    const result = await this.accountService.detailAccount(id);
    return {
      data: result,
      message: 'Lấy thông tin chi tiết tài khoản thành công'
    }
  }

  @Patch('delete/:id')
  async deleteAccount(@Param('id') id: string) {
    await this.accountService.deleteAccount(id);
    return {
      message: 'Xóa tài khoản thành công'
    }
  }
}
