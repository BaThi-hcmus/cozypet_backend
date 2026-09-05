import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PartConfigDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;

  @IsOptional()
  @IsNumber()
  scale?: number;

  @IsOptional()
  @IsNumber()
  rotation?: number;

  @IsOptional()
  @IsNumber()
  zIndex?: number;

  @IsOptional()
  @IsString()
  transformOrigin?: string;
}