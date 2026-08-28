import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ require: true })
  password: string;

  @Prop({ require: true })
  fullName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({
    enum: ['staff', 'admin'],
    default: 'staff'
  })
  role: string;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;

  @Prop({ default: 0 })
  salary: number;

  @Prop({ default: false })
  deleted: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);