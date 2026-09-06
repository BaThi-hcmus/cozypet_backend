import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PartConfigDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber()
  x?: number;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber()
  y?: number;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber()
  scale?: number;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber()
  rotation?: number;

  @IsOptional()
  @Transform(({ value }) => (value != undefined ? Number(value) : value))
  @IsNumber()
  zIndex?: number;

  @IsOptional()
  @IsString()
  transformOrigin?: string;
}