import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { AccountModule } from './account.module';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>
  ) { };

  async getAll(): Promise<AccountDocument[]> {
    const accounts = await this.accountModel.find({
      deleted: false
    });
    return accounts;
  }
}
