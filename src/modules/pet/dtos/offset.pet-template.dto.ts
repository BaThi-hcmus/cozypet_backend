import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class OffsetDto {
  @IsNotEmpty({ message: 'tọa độ offset x không được để trống' })
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber({}, { message: 'Tọa độ offset x phải là số' })
  x: number;

  @IsNotEmpty({ message: 'tọa độ offset y không được để trống' })
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber({}, { message: 'Tọa độ offset y phải là số' })
  y: number;
}