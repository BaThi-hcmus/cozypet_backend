import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { Item, ItemSchema } from './schemas/item.schema';

@Module({
  imports: [
    ToolBarModule,
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema }
    ])
  ],
  controllers: [ItemController],
  providers: [
    ItemService,
    CloudinaryService
  ],
})
export class ItemModule { }
