import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class RoomSlot {
  @Prop({ required: true })
  x: number; // Tọa độ ngang trên màn hình phòng

  @Prop({ required: true })
  y: number; // Tọa độ dọc trên màn hình phòng

  @Prop({
    required: true,
    enum: ['furniture', 'decoration', 'food', 'toy'],
  })
  type: string; // Loại item tương ứng

  @Prop({ required: true, trim: true })
  category: string; // Danh mục (bàn, ghế, tủ,...)

  @Prop({ required: true, trim: true })
  slotType: string; // Vị trí chi tiết (left_floor, right_wall,...)

  @Prop({ default: 0 })
  zIndex: number; // Thứ tự lớp hiển thị (layer)

  @Prop({ type: Types.ObjectId, ref: 'Item', default: null })
  defaultItemId: Types.ObjectId; // ID món đồ mặc định sẵn trong phòng
}

export const RoomSlotSchema = SchemaFactory.createForClass(RoomSlot);