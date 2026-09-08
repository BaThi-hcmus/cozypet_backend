import { IsEnum, IsIn, IsOptional, IsString, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
import { PartConfigDto } from './part-config.pet-template.dto';
import { LayersConfigDto } from './layers-config.pet-template.dto';
import { OffsetDto } from './offset.pet-template.dto';

export class UpdatePetTemplateDto {
  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsIn(['dog', 'cat'], { message: 'Loài phải là dog hoặc cat' })
  species?: string;

  @IsOptional()
  @IsString()
  name?: string;

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
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return plainToInstance(LayersConfigDto, parsed);
      } catch (err) {
        return value;
      }
    }
    return value;
  })
  @IsObject({ message: 'Layers phải là một object' })
  @ValidateNested()
  @Type(() => LayersConfigDto)
  layers?: LayersConfigDto;

  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái chỉ có thể là active hoặc inactive',
  })
  status?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  deleted?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber({}, { message: 'global zoom phải là số nguyên' })
  globalZoom?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value == 'string') {
      console.log(value);
      try {
        const parse = JSON.parse(value);
        console.log('Parsed thành công:', parse);
        return plainToInstance(OffsetDto, parse);
      } catch (error) {
        console.error('JSON.parse bị lỗi:', error);
        return value;
      }
    }
    return value;
  })
  @IsObject({ message: 'Global offset phải là một object' })
  @ValidateNested()
  @Type(() => OffsetDto)
  globalOffset?: OffsetDto;
}
