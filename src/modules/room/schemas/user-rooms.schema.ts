import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserRoomDocument = UserRoom & Document;

@Schema({ timestamps: true, collection: 'user_rooms' })
export class UserRoom {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true, index: true })
  roomId: Types.ObjectId;

  @Prop({ default: false })
  isCurrent: boolean;

  // chỉ có bed room mới có trường này
  @Prop({ type: Boolean })
  isLightOn?: boolean;

  @Prop({ type: Object, default: {} })
  decorations: Record<string, Types.ObjectId>;
}

export const UserRoomSchema = SchemaFactory.createForClass(UserRoom);