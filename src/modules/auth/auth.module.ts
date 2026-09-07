import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { AdminAuthController } from './admin.auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema }
    ])
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AuthModule { }
