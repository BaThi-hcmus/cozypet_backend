import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { AdminAuthController } from './admin.auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/schemas/account.schema';
import { JwtService } from '@nestjs/jwt';
import { ClientAuthController } from './client.auth.controller';
import { ClientAuthService } from './client.auth.service';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AdminAuthController, ClientAuthController],
  providers: [AdminAuthService, ClientAuthService, JwtService],
})
export class AuthModule { }
