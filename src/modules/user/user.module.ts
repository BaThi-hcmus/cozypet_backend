import { Module } from '@nestjs/common';
import { ClientUserService } from './client.user.service';
import { ClientUserController } from './client.user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [ClientUserController],
  providers: [ClientUserService, JwtService],
})
export class UserModule { }
