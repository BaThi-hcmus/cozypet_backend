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
import { UserRoom, UserRoomSchema } from './schemas/user-rooms.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ToolBarModule,
    CloudinaryModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Account.name, schema: AccountSchema },
      { name: UserRoom.name, schema: UserRoomSchema }
    ])
  ],
  controllers: [AdminRoomController, ClientRoomController],
  providers: [
    AdminRoomService,
    ClientRoomService,
  ],
})
export class RoomModule { }
