import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
    ]),
    ToolBarModule
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    CloudinaryService
  ],
})
export class AccountModule { }
