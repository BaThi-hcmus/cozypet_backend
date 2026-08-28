import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt validation toàn cục
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các trường không có trong DTO (bảo mật hơn)
    forbidNonWhitelisted: true, // Trả về lỗi nếu client gửi lên trường lạ hoắc không có trong DTO
    transform: true, // làm sạch các giá trị không cần thiết
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
