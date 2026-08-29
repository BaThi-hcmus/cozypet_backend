import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { ItemModule } from './item/item.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    AccountModule,
    ItemModule,
    RoomModule,
  ],
  controllers: [],
  providers: []
})

export class AdminModule { };