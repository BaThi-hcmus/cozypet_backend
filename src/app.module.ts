import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './modules/account/account.module';
import { ItemModule } from './modules/item/item.module';
import { PetModule } from './modules/pet/pet.module';
import { RoomModule } from './modules/room/room.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Khởi tạo config module để đọc file .env toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Kết nối MongoDB Atlas sử dụng ConfigService để lấy chuỗi kết nối an toàn
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),

    AccountModule,
    ItemModule,
    PetModule,
    RoomModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
