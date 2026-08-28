import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
// UploadApiResponse là kiểu dữ liệu khi upload file thành công
// UploadApiErrorResponse là kiểu dữ liệu khi upload file thất bại
// => dùng tạo kiểu dữ liệu để tránh ts báo lỗi
export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;