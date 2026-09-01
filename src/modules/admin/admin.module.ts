import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { ItemModule } from './item/item.module';
import { RoomModule } from './room/room.module';
import { PetModule } from './pet/pet.module';
import { PetTemplateModule } from './pet-template/pet-template.module';

@Module({
  imports: [
    AccountModule,
    ItemModule,
    RoomModule,
    PetModule,
    PetTemplateModule,
  ],
  controllers: [],
  providers: []
})

export class AdminModule { };