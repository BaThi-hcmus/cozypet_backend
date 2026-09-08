import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PetStatus } from './status.pet.schema';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  petTemplateId!: string;

  @Prop({ type: String })
  name: string;

  @Prop({ default: true })
  isCurrent: boolean;

  @Prop({ type: Number, default: 1 })
  level: number;

  @Prop({ type: Number, default: 0 })
  exp: number;

  @Prop({ type: PetStatus })
  status!: PetStatus;

  @Prop({ type: Boolean, default: false })
  deleted!: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);