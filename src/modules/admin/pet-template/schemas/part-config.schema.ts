import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

// Định nghĩa sub schema cho từng bộ phận của pet
@Schema({ _id: false })
export class PartConfig {
  @Prop({ required: true })
  url: string;

  @Prop({ default: 0 })
  x: number;

  @Prop({ default: 0 })
  y: number;

  @Prop({ default: 1 })
  scale: number;

  @Prop({ default: 0 })
  rotation: number;

  @Prop({ default: 0 })
  zIndex: number;

  @Prop({ default: 'center center' })
  transformOrigin: string;
}

export const PartConfigSchema = SchemaFactory.createForClass(PartConfig);