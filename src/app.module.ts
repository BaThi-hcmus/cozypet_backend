import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './modules/admin/admin.module';

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

    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
