import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['furniture', 'decoration', 'food', 'toy'], {
    message: 'Loại vật phẩm chỉ có thể là furniture, decoration, food hoặc toy',
  })
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Giá phải là kiểu số' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Chiều rộng phải là kiểu số' })
  width?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Chiều cao phải là kiểu số' })
  height?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái chỉ có thể là active hoặc inactive',
  })
  status?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  deleted?: boolean;

  @IsOptional()
  @IsString()
  slotType?: string;

  @IsOptional()
  @IsNumber({}, { message: 'zIndex phải là kiểu số' })
  zIndex?: number;

  @IsOptional()
  @IsNumber({}, { message: 'scaleFactor phải là kiểu số' })
  scaleFactor?: number;
}
