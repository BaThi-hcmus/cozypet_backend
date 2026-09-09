import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoomSlot } from './room-slot.schema';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true, collection: 'rooms' })
export class Room {
  @Prop({ required: true, trim: true })
  name: string; 

  @Prop({ required: true, unique: true, trim: true })
  code: string; 

  @Prop({ trim: true, default: '' })
  description: string; 

  @Prop({ required: true })
  background_url: string; 

  @Prop({default: 0})
  price: number;

  @Prop({ required: true })
  isDefault: boolean;

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