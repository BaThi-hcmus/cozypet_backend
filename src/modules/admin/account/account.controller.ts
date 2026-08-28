import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { };

  // @Get()
  // async getAll() {
  //   try {
  //     const accounts = this.accountService.getAll();
  //     return {
  //       data: accounts,
  //       message: 'Lấy danh sách tài khoản thành công'
  //     }
  //   } catch (error) {
  //     return {
  //       message: 'Lấy danh sách tài khoản thất bại',
  //       error: error.message
  //     }
  //   }
  // }
}
