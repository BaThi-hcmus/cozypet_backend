import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PartConfig, PartConfigSchema } from './part-config.pet-template.schema';
import { Offset } from './offset.pet-template.schema';
import { RoomConfig, RoomConfigSchema } from './room-config.pet-template.schema';

export type PetTemplateDocument = PetTemplate & Document;

@Schema({ timestamps: true, collection: 'pet_templates' })
export class PetTemplate {
  @Prop({ required: true, unique: true, trim: true })
  templateId!: string;

  @Prop({ required: true, enum: ['dog', 'cat'] })
  species!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  avatar!: string;

  @Prop({
    type: {
      livingRoom: { type: RoomConfigSchema, required: true },
      kitchen: { type: RoomConfigSchema, required: true },
      bedRoom: { type: RoomConfigSchema, required: true },
    },
    required: true,
  })
  rooms!: {
    livingRoom: RoomConfig;
    kitchen: RoomConfig;
    bedRoom: RoomConfig;
  };

  @Prop({ required: true, trim: true })
  primaryColor!: string;

  @Prop({ default: 'none', trim: true })
  secondaryColor!: string;

  @Prop({ required: true, trim: true })
  coatPattern!: string;

  @Prop({ required: true, trim: true })
  coatLength!: string;

  @Prop({
    type: {
      earShape: { type: String, default: null },
      faceShape: { type: String, default: null },
      eyeColor: { type: String, default: null },
      size: { type: String, default: null },
      earType: { type: String, default: null },
      muzzleShape: { type: String, default: null },
      tailType: { type: String, default: null },
    },
    _id: false,
    default: {},
  })
  traits!: {
    earShape?: string;
    faceShape?: string;
    eyeColor?: string;
    size?: string;
    earType?: string;
    muzzleShape?: string;
    tailType?: string;
  };

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: string;

  @Prop({ default: false })
  deleted!: boolean;
}

export const PetTemplateSchema = SchemaFactory.createForClass(PetTemplate);

PetTemplateSchema.index({ species: 1, primaryColor: 1, coatPattern: 1 });