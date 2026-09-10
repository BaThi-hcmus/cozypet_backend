import { Module } from '@nestjs/common';
import { ItemService } from './admin.item.service';
import { ItemController } from './admin.item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { Item, ItemSchema } from './schemas/item.schema';
import { Account, AccountSchema } from '../account/schemas/account.schema';
import { ClientItemController } from './client.item.controller';
import { ClientItemService } from './client.item.service';

@Module({
  imports: [
    ToolBarModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Account.name, schema: AccountSchema }
    ])
  ],
  controllers: [ItemController, ClientItemController],
  providers: [ItemService, ClientItemService],
})
export class ItemModule { }
