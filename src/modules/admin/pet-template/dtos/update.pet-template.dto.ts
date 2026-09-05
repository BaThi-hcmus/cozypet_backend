import { IsEnum, IsIn, IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
import { PartConfigDto } from './part-config.dto';
import { LayersConfigDto } from './layers-config.dto';

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
}
