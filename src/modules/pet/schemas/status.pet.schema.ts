import { Prop } from "@nestjs/mongoose";

export class PetStatus {
  @Prop({ type: 'number', default: 100 })
  hunger: number;

  @Prop({ type: 'number', default: 100 })
  energy: number;

  @Prop({ type: 'number', default: 100 })
  happiness: number;

  @Prop({ default: false })
  isSleeping: boolean;

  @Prop({ default: Date.now() })
  lastUpdated: Date;
}