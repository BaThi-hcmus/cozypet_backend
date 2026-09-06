import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  petTemplateId: string;

  @Prop({ required: true })
  name: string;

  // Gồm năng lượng, chỉ số đói và hạnh phúc
  @Prop()
  status: Object;

  @Prop({ default: false })
  deleted: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);