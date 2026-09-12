import { IsNumber, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LayersConfigDto } from './layers-config.pet-template.dto';
import { OffsetDto } from './offset.pet-template.dto';

export class RoomConfigDto {
  @IsNumber({}, { message: 'global zoom phải là số' })
  globalZoom: number;

  @ValidateNested()
  @Type(() => OffsetDto)
  globalOffset: OffsetDto;

  @IsObject({ message: 'Layers phải là một object' })
  @ValidateNested()
  @Type(() => LayersConfigDto)
  layers: LayersConfigDto;
}

export class RoomsConfigDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => RoomConfigDto)
  livingRoom?: RoomConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoomConfigDto)
  kitchen?: RoomConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoomConfigDto)
  bedRoom?: RoomConfigDto;
}
