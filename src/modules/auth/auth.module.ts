import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin.auth.service';
import { AdminAuthController } from './admin.auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/schemas/account.schema';
import { JwtService } from '@nestjs/jwt';
import { ClientAuthController } from './client.auth.controller';
import { ClientAuthService } from './client.auth.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Room, RoomSchema } from '../room/schemas/room.schema';
import { Item, ItemSchema } from '../item/schemas/item.schema';
import { UserItem, UserItemSchema } from '../item/schemas/user-items.schema';
import { UserRoom, UserRoomSchema } from '../room/schemas/user-rooms.schema';
import { Pet, PetSchema } from '../pet/schemas/pet.schema';
import { PetTemplate, PetTemplateSchema } from '../pet/schemas/pet-template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: UserRoom.name, schema: UserRoomSchema },
      { name: Item.name, schema: ItemSchema },
      { name: UserItem.name, schema: UserItemSchema },
      { name: Pet.name, schema: PetSchema },
      { name: PetTemplate.name, schema: PetTemplateSchema }
    ])
  ],
  controllers: [AdminAuthController, ClientAuthController],
  providers: [AdminAuthService, ClientAuthService, JwtService],
  exports: [JwtService],
})
export class AuthModule { }
