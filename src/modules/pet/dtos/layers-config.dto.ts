import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartConfigDto } from './part-config.dto';

export class LayersConfigDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)  // chuyển đổi JSON thành instance của class PartConfigDto
  body?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  head?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  leftArm?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  rightArm?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  leftLeg?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  rightLeg?: PartConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartConfigDto)
  tail?: PartConfigDto;
}
