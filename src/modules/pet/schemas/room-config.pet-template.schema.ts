import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Offset, OffsetSchema } from "./offset.pet-template.schema";
import { PartConfig } from "./part-config.pet-template.schema";

@Schema({ _id: false })
export class RoomConfig {
  @Prop({ required: true })
  globalZoom!: number;

  @Prop({ type: OffsetSchema, required: true })
  globalOffset!: Offset;

  @Prop({ type: Object, required: true })
  layers!: Record<string, PartConfig>;
}

export const RoomConfigSchema = SchemaFactory.createForClass(RoomConfig);