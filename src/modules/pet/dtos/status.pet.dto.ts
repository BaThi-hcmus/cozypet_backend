import { IsNumber, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class StatusDto {
  @IsNumber()
  @IsOptional()
  hunger?: number;

  @IsNumber()
  @IsOptional()
  energy?: number;

  @IsNumber()
  @IsOptional()
  happiness?: number;

  @IsBoolean()
  @IsOptional()
  isSleeping?: boolean;

  @IsDate()
  @IsOptional()
  lastUpdated?: Date;
}
