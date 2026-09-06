import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ITEM_CATEGORY_VALUES,
  ITEM_SLOT_TYPE_VALUES,
  ITEM_TYPE_VALUES,
} from 'src/constants/item.constants';

export class CreateItemDto {
  @IsNotEmpty({ message: 'Tên vật phẩm không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Loại vật phẩm không được để trống' })
  @IsIn(ITEM_TYPE_VALUES, {
    message: 'Loại vật phẩm không hợp lệ',
  })
  type: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsIn(ITEM_CATEGORY_VALUES, {
    message: 'Danh mục không hợp lệ',
  })
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

  @IsNotEmpty({ message: 'Vị trí đặt (slotType) không được để trống' })
  @IsIn(ITEM_SLOT_TYPE_VALUES, {
    message: 'Vị trí đặt (slotType) không hợp lệ',
  })
  slotType: string;


}
