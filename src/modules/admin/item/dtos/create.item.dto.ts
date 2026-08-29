import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty({ message: 'Tên vật phẩm không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại vật phẩm không được để trống' })
  @IsEnum(['furniture', 'decoration', 'food', 'toy'], {
    message: 'Loại vật phẩm chỉ có thể là furniture, decoration, food hoặc toy',
  })
  type: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsString()
  category: string;

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
  @IsString()
  slotType?: string;
}
