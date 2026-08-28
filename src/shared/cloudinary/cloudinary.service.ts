import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response'; // File định nghĩa type ở bước sau
import * as streamifier from 'streamifier'; // Dùng để chuyển buffer của multer thành stream

@Injectable()
export class CloudinaryService {
  constructor() {
    // Cấu hình Cloudinary sử dụng thông tin từ biến môi trường
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // file: Express.Multer.File là đối tượng File được bắt bởi Muter thông qua FileInterceptor (được frontend gửi qua)
  // có trường file.buffer là dữ liệu thô của file
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // đây là phương thức của cloudinary dùng tạo ra 1 luồng dữ liệu
      // nó cho phép đẩy dữ liệu trực tiếp dạng stream lên cloud => tối ưu hiệu năng
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'images' }, // Tên thư mục sẽ được tạo tự động trên Cloudinary

        // Hàm này tự động chạy sau khi cloudinary xử lý xong file
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      // Dùng streamifier để đẩy buffer của file lên cloud
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}