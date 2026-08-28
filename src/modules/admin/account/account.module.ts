import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { SharedAdminModule } from 'src/shared/shared.admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
    ]),
    SharedAdminModule
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule { }
