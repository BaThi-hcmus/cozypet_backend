import { Controller, Get, Patch, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create.account.dto';
import { UpdateAccountDto } from './dtos/update.account.dto';

@Controller('admin/accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { };

  @Get()
  async getAll(status: string, keyword: string, page: string, sortType: string) {
    try {
      const result = this.accountService.getAll(status, keyword, page, sortType);
      return {
        data: result,
        message: 'Lấy danh sách tài khoản thành công'
      }
    } catch (error) {
      return {
        message: 'Lấy danh sách tài khoản thất bại',
        error: error.message
      }
    }
  }

  @Post('create')
  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      await this.accountService.createAccount(createAccountDto);
      return {
        message: 'Tạo tài khoản thành công'
      }
    } catch (error) {
      return {
        message: 'Tạo tài khoản thất bại',
        error: error.message
      }
    }
  }

  @Patch('update')
  async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
    try {
      await this.accountService.updateAccount(id, updateAccountDto);
      return {
        message: 'Cập nhật tài khoản thành công'
      }
    } catch (error) {
      return {
        message: 'Cập nhật tài khoản không thành công',
        error: error.message
      }
    }
  }

  @Get('detail')
  async getDetailAccount(id: string) {
    try {
      const result = await this.accountService.detailAccount(id);
      return {
        date: result,
        message: 'Lấy thông tin chi tiết tài khoản thành công'
      }
    } catch (error) {
      return {
        message: 'Lấy thông tin chi tiết tài khoản thất bại',
        error: error.message
      }
    }
  }
}
