import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePetTemplateDto {
  @IsNotEmpty({ message: 'Mã template không được để trống' })
  @IsString()
  templateId: string;

  @IsNotEmpty({ message: 'Loài không được để trống' })
  @IsIn(['dog', 'cat'], { message: 'Loài phải là dog hoặc cat' })
  species: string;

  @IsNotEmpty({ message: 'Tên mẫu pet không được để trống' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
