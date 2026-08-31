import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  ITEM_CATEGORY_VALUES,
  ITEM_SLOT_TYPE_VALUES,
  ITEM_TYPE_VALUES,
} from 'src/constants/item.constants';

@Schema({ _id: false })
export class RoomSlot {
  @Prop({ required: true })
  x: number; // Tọa độ ngang trên màn hình phòng

  @Prop({ required: true })
  y: number; // Tọa độ dọc trên màn hình phòng

  @Prop({
    required: true,
    enum: ITEM_TYPE_VALUES,
  })
  type: string; // Loại item tương ứng

  @Prop({ required: true, trim: true, enum: ITEM_CATEGORY_VALUES })
  category: string; // Danh mục (bàn, ghế, tủ,...)

  @Prop({ required: true, trim: true, enum: ITEM_SLOT_TYPE_VALUES })
  slotType: string; // Vị trí chi tiết (left_floor, right_wall,...)

  @Prop({ default: 0 })
  zIndex: number; // Thứ tự lớp hiển thị (layer)

  @Prop({ default: 1 })
  scaleFactor: number; // Tỉ lệ phóng to thu nhỏ của item trong phòng

  @Prop({ type: Types.ObjectId, ref: 'Item', default: null })
  defaultItemId: Types.ObjectId; // ID món đồ mặc định sẵn trong phòng
}

export const RoomSlotSchema = SchemaFactory.createForClass(RoomSlot);