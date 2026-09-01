import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty({message: 'Tên thú cưng không được để trống'})
  @IsString({message: 'Tên thú cưng phải là chuỗi kí tự'})
  name: string;

  @IsNotEmpty({message: 'Avatar url không được để trống'})
  @IsString({message: 'Avatar url phải là chuỗi kí tự'})
  avatar: string;
}
