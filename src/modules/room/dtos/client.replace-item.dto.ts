import { IsNotEmpty, IsString } from "class-validator";

export class ReplaceItemDto {
  @IsNotEmpty({ message: 'slotKey không được để trống' })
  @IsString()
  slotKey: string;

  @IsNotEmpty({ message: 'Id của item thêm vào không được trống' })
  @IsString()
  insertItemId: string;
}