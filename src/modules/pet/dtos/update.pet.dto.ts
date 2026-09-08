import { IsString, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { StatusDto } from './status.pet.dto';

export class UpdatePetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  level?: number;

  @IsNumber()
  @IsOptional()
  exp?: number;

  @ValidateNested()
  @IsOptional()
  status?: StatusDto;
}
