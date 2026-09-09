import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ITEM_CATEGORY_VALUES,
  ITEM_SLOT_TYPE_VALUES,
  ITEM_TYPE_VALUES,
} from 'src/constants/item.constants';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true, collection: 'items' })
export class Item {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({required: true})
  roomCode: string;

  @Prop({
    required: true,
    enum: ITEM_TYPE_VALUES,
  })
  type: string;

  @Prop({ required: true, enum: ITEM_CATEGORY_VALUES })
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
    required: true,
    enum: ITEM_SLOT_TYPE_VALUES,
    default: 'center_floor',
    trim: true,
  })
  slotType: string;



  @Prop({ default: false })
  deleted: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);