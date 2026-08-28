import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');

  app.use(cors({
    origin: 'http://localhost:5173', // Hoặc dùng true để cho phép mọi nguồn trong môi trường dev
    credentials: true // Cho phép nhận cookie/token nếu có
  }));

  // Kích hoạt validation toàn cục
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các trường không có trong DTO (bảo mật hơn)
    forbidNonWhitelisted: true, // Trả về lỗi nếu client gửi lên trường lạ hoắc không có trong DTO
    transform: true, // Tự động biến đổi payload thành DTO instance
    transformOptions: {
      enableImplicitConversion: true, // Tự động ép kiểu dữ liệu nguyên thủy (String -> Number, Boolean...) theo DTO toàn ứng dụng
    },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
