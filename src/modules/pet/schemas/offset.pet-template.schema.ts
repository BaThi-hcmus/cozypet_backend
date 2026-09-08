import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

// Định nghĩa offset
@Schema({ _id: false })
export class Offset {
  @Prop({ default: 0 })
  x: number;

  @Prop({ default: 0 })
  y: number;
}

export const OffsetSchema = SchemaFactory.createForClass(Offset);