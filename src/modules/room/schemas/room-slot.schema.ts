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
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop({
    required: true,
    enum: ITEM_TYPE_VALUES,
  })
  type: string;

  @Prop({ required: true, trim: true, enum: ITEM_CATEGORY_VALUES })
  category: string;

  @Prop({ required: true, trim: true, enum: ITEM_SLOT_TYPE_VALUES })
  slotType: string;

  @Prop({ default: 0 })
  zIndex: number;

  @Prop({ default: 1 })
  scaleFactor: number;

  @Prop({ type: Types.ObjectId, ref: 'Item', default: null })
  defaultItemId: Types.ObjectId;
}

export const RoomSlotSchema = SchemaFactory.createForClass(RoomSlot);