import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
  @Prop({ type: Types.ObjectId, default: null })
  userId: Types.ObjectId;

  // Dùng khi user chưa đăng nhập (lưu chuỗi ngẫu nhiên từ client gửi lên)
  @Prop({ type: String, default: null, index: true })
  guestId: string;

  @Prop({ required: true, default: 'Boss' })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ default: 100, min: 0, max: 100 })
  hunger: number;

  @Prop({ default: 100, min: 0, max: 100 })
  happiness: number;

  @Prop({ default: 100, min: 0, max: 100 })
  energy: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);