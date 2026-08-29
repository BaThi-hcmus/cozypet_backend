import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true, collection: 'items' })
export class Item {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    enum: ['furniture', 'decoration', 'food', 'toy'],
  })
  type: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 1 })
  width: number;

  @Prop({ default: 1 })
  height: number;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @Prop({
    default: 'center_floor',
    trim: true,
  })
  slotType: string;

  @Prop({ default: 0 })
  zIndex: number;

  @Prop({ default: 1 })
  scaleFactor: number;

  @Prop({ default: false })
  deleted: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);