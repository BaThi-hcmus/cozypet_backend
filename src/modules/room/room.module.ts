import { Module } from '@nestjs/common';
import { AdminRoomService } from './admin.room.service';
import { AdminRoomController } from './admin.room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { Room, RoomSchema } from './schemas/room.schema';
import { Item, ItemSchema } from '../item/schemas/item.schema';
import { ClientRoomService } from './client.room.service';
import { ClientRoomController } from './client.room.controller';
import { Account, AccountSchema } from '../account/schemas/account.schema';

@Module({
  imports: [
    ToolBarModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Account.name, schema: AccountSchema}
    ])
  ],
  controllers: [AdminRoomController, ClientRoomController],
  providers: [
    AdminRoomService,
    ClientRoomService,
  ],
})
export class RoomModule { }
