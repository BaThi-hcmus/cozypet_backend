import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  avatar: string;

  // Lưu danh sách id các vật phẩm mà user sở hữu
  @Prop()
  items: [];

  // lưu danh sách các phòng mà user sở hữu
  @Prop()
  rooms: [];

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);