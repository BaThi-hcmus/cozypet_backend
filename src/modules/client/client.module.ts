import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { RoomModule } from './room/room.module';
import { PetModule } from './pet/pet.module';
import { ShopModule } from './shop/shop.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    AuthModule,
    RoomModule,
    PetModule,
    ShopModule,
    InventoryModule
  ],
  controllers: [],
  providers: []
})

export class ClientModule { };