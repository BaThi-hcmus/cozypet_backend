import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @IsString()
  code: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  @IsBoolean({ message: 'Trường mặc định phải là kiểu boolean' })
  isDefault?: boolean;

  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({}, {message: 'Giá phòng phải là số'})
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  background_url?: string;

  @IsOptional()
  slots?: any;

  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái chỉ có thể là active hoặc inactive',
  })
  status?: string;
}
