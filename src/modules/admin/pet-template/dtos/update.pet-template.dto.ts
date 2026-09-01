import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

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
  @IsEnum(['active', 'inactive'], {
    message: 'Trạng thái chỉ có thể là active hoặc inactive',
  })
  status?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  deleted?: boolean;
}
