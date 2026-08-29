import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoomSlot } from './room-slot.schema';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true, collection: 'rooms' })
export class Room {
  @Prop({ required: true, trim: true })
  name: string; // Tên phòng (ví dụ: Phòng cơ bản, phong cách tết,...)

  @Prop({ required: true, unique: true, trim: true })
  code: string; // Mã định danh không dấu dạng slug (default_room, tet_room,...)

  @Prop({ trim: true, default: '' })
  description: string; // Mô tả ngắn gọn

  @Prop({ required: true })
  background_url: string; // Đường dẫn ảnh nền căn phòng

  // Danh sách các slot gắn đồ trong phòng
  @Prop({ type: Object, default: {} })
  slots: Record<string, RoomSlot>;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);