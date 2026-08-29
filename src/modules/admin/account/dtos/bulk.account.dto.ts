import { IsArray, IsNotEmpty } from "class-validator";

export class BulkActionDto {
  @IsNotEmpty({ message: 'danh sách id không được để trống' })
  @IsArray({ message: 'Danh sách id phải là 1 mảng' })
  ids: string[];

  @IsNotEmpty({ message: 'Nội dung cập nhật không được để trống' })
  payload: any
}