import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  background_url?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  @IsBoolean({ message: 'Trường mặc định phải là kiểu boolean' })
  isDefault?: any;

  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({}, {message: 'Giá phòng phải là số'})
  price?: number;

  @IsOptional()
  slots?: any;

  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái chỉ có thể là active hoặc inactive',
  })
  status?: string;

  @IsOptional()
  @IsEnum([true, false])
  deleted?: boolean;
}
