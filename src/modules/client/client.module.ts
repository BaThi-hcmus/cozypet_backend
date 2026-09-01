import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { RoomModule } from './room/room.module';
import { PetModule } from './pet/pet.module';
import { ShopModule } from './shop/shop.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    AuthModule,
    OnboardingModule,
    RoomModule,
    PetModule,
    ShopModule,
    InventoryModule
  ],
  controllers: [],
  providers: []
})

export class ClientModule { };