import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from '../account/schemas/account.schema';
import { LoginDto } from './dtos/login.dto';
import { Model } from 'mongoose';
// mã hóa mật khẩu
import * as bcrypt from 'bcrypt';
// tạo chuỗi random
import * as crypto from 'crypto'


@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>
  ) { }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    // kiểm tra email có tồn tại không
    const accountExist = await this.accountModel.findOne({
      email: email,
      status: 'active',
      deleted: false
    })

    if (!accountExist) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    // xác minh mật khẩu
    const isMatch = await bcrypt.compare(password, accountExist.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    const sessionId = crypto.randomUUID();

    // lưu vào DB
    await this.accountModel.updateOne(
      { _id: accountExist._id },
      { sessionId: sessionId }
    )
    return sessionId;
  }

  async logout(id: string): Promise<void> {
    await this.accountModel.updateOne(
      { _id: id },
      { sessionId: null }
    )
  }
}
