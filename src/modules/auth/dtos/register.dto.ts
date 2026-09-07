import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi kí tự' })
  fullName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString({ message: 'Email phải là chuỗi kí tự' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'password phải là chuỗi kí tự' })
  password: string;
}