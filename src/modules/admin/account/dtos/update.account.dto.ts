import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber } from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email phải đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(['staff', 'admin'], { message: 'Role chỉ có thể là staff hoặc admin' })
  role?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Lương phải là kiểu số' })
  salary?: number;
}