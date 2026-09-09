import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserItemDocument = UserItem & Document;

@Schema({ timestamps: true, collection: 'user_items' })
export class UserItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'Item', required: true, index: true })
  itemId: Types.ObjectId; 

  @Prop({ type: Number, required: true, default: 1, min: 1 })
  quantity: number; 
}

export const UserItemSchema = SchemaFactory.createForClass(UserItem);