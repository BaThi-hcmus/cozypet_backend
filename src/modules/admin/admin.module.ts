import { Module } from "@nestjs/common";
import { AccountModule } from "./account/account.module";
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    AccountModule,
    ItemModule,
  ],
  controllers: [],
  providers: []
})

export class AdminModule { };