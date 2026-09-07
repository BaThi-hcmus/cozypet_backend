import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString({ message: 'Email phải là chuỗi kí tự' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'password phải là chuỗi kí tự' })
  password: string;
}