import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { Item, ItemDocument } from '../item/schemas/item.schema';

@Injectable()
export class ClientRoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) { }

  async getRoomDefault(): Promise<any> {
    const roomDefault = await this.roomModel.findOne({
      status: 'active',
      deleted: false,
      isDefault: true
    })

    if (!roomDefault) {
      throw new NotFoundException('Không tìm thấy room mặc định');
    }

    // lấy các nội thất mặc định của room mặc định
    // lưu các id của item
    const itemIds: string[] = [];
    for (const slot of Object.keys(roomDefault.slots)) {
      const itemId = roomDefault.slots[slot].defaultItemId;
      if (itemId) {
        itemIds.push(itemId.toString());
      }
    }

    const itemsDefaultFromDb = await this.itemModel.find({
      _id: { $in: itemIds }
    })

    // map ngược lại để lấy thêm định danh riêng của mỗi item default
    const itemsDefault: Record<string, any> = {};
    for (const item of itemsDefaultFromDb) {
      for (const slot of Object.keys(roomDefault.slots)) {
        if (roomDefault.slots[slot].defaultItemId?.toString() === item._id.toString()) {
          itemsDefault[slot] = item;
          break;
        }
      }
    }

    return {
      roomDefault: roomDefault,
      itemsDefault: itemsDefault
    }
  }

  async getAllRooms(): Promise<RoomDocument[]> {
    const rooms = await this.roomModel.find({
      deleted: false,
      status: 'active'
    })

    return rooms;
  }
}
