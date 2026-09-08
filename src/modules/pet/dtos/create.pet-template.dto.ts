import { IsIn, IsNotEmpty, IsOptional, IsString, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
import { PartConfigDto } from './part-config.pet-template.dto';
import { LayersConfigDto } from './layers-config.pet-template.dto';
import { OffsetDto } from './offset.pet-template.dto';

export class CreatePetTemplateDto {
  @IsNotEmpty({ message: 'Mã template không được để trống' })
  @IsString()
  templateId: string;

  @IsNotEmpty({ message: 'Loài không được để trống' })
  @IsIn(['dog', 'cat'], { message: 'Loài phải là dog hoặc cat' })
  species: string;

  @IsNotEmpty({ message: 'Tên mẫu pet không được để trống' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  head?: string;

  @IsOptional()
  @IsString()
  leftArm?: string;

  @IsOptional()
  @IsString()
  rightArm?: string;

  @IsOptional()
  @IsString()
  leftLeg?: string;

  @IsOptional()
  @IsString()
  rightLeg?: string;

  @IsOptional()
  @IsString()
  tail?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // Nếu nhận được chuỗi JSON từ FormData, tiến hành parse ngược lại thành Object
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        // chuyển thành instance của class LayersConfigDto
        return plainToInstance(LayersConfigDto, parsed);
      } catch (err) {
        return value; // Nếu parse lỗi, giữ nguyên để class-validator xử lý tiếp
      }
    }
    return value;
  })
  @IsObject({ message: 'Layers phải là một object chứa các bộ phận' })
  @ValidateNested()
  @Type(() => LayersConfigDto)
  layers?: LayersConfigDto;

  @IsNotEmpty({ message: 'global zoom không được để trống' })
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber({}, { message: 'global zoom phải là số nguyên' })
  globalZoom: number;

  @IsNotEmpty({ message: 'global offset không được để trống' })
  @Transform(({ value }) => {
    if (typeof value == 'string') {
      try {
        const parse = JSON.parse(value);
        return plainToInstance(OffsetDto, parse);
      } catch (error) {
        return value;
      }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => OffsetDto)
  globalOffset: OffsetDto;
}
