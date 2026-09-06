import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
    ]),
    ToolBarModule,
    CloudinaryModule
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule { }
