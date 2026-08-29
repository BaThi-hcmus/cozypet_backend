import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    ToolBarModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema }
    ])
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    CloudinaryService
  ],
})
export class RoomModule {}
