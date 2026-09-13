import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId, Types } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { Item, ItemDocument } from '../item/schemas/item.schema';
import { ReplaceItemDto } from './dtos/client.replace-item.dto';
import { UserRoom, UserRoomDocument } from './schemas/user-rooms.schema';
import { UserItem, UserItemDocument } from '../item/schemas/user-items.schema';

@Injectable()
export class ClientRoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(UserRoom.name) private readonly userRoomModel: Model<UserRoomDocument>,
    @InjectModel(UserItem.name) private readonly userItemModel: Model<UserItemDocument>,
    @InjectConnection() private readonly connection: Connection
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

  async replaceItemInRoom(
    userId: string,
    userRoomId: string,
    replaceItemDtp: ReplaceItemDto
  ): Promise<void> {
    const { slotKey, insertItemId } = replaceItemDtp;
    const userRoom = await this.userRoomModel.findOne({
      _id: new Types.ObjectId(userRoomId),
      userId: new Types.ObjectId(userId)
    })
    if (!userRoom) {
      throw new NotFoundException('Không tìm thấy user room id');
    }

    await this.userRoomModel.updateOne(
      {
        _id: new Types.ObjectId(userRoomId),
        userId: new Types.ObjectId(userId)
      },
      {
        $set: {
          [`decorations.${slotKey}`]: new Types.ObjectId(insertItemId)
        }
      }
    );
  }

  async getRoomByCode(
    roomCode: string,
    userId: string
  ): Promise<any> {
    const room = await this.roomModel.findOne({
      code: roomCode,
      status: 'active',
      deleted: false,
      price: 0
    });

    if (!room) {
      throw new NotFoundException('Room không tồn tại hoặc đây không phải room mặc định');
    }

    // Kiểm tra xem Database đã có userRoom này chưa
    let existingUserRoom = await this.userRoomModel.findOne({
      userId: new Types.ObjectId(userId),
      roomId: room._id
    });

    // do dữ liệu từ zustand đã bị sửa đổi => cung cấp lại
    if (existingUserRoom) {
      const userItemIds = Object.values(existingUserRoom.decorations)
        .filter(id => id != null);
      const userItems = await this.userItemModel.find({
        userId: new Types.ObjectId(userId),
        itemId: { $in: userItemIds }
      });
      const items = await this.itemModel.find({
        _id: { $in: userItems.map(ui => ui.itemId) },
        status: 'active',
        deleted: false
      });

      return {
        room: room,
        userRoom: existingUserRoom,
        items: items,
        userItems: userItems
      };
    }

    // transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Lấy các default item
      const defaultItemIds = Object.values(room.slots || {})
        .map(slot => slot.defaultItemId)
        .filter(id => id != null);

      const items = await this.itemModel.find({
        _id: { $in: defaultItemIds },
        status: 'active',
        deleted: false
      });

      let newUserItems: any = [];
      for (const id of defaultItemIds) {
        const itemExist = items.find(item => item._id.toString() === id.toString());
        if (!itemExist) continue;

        newUserItems.push({
          userId: new Types.ObjectId(userId),
          itemId: itemExist._id,
          quantity: 1
        });
      }

      // Thêm user items
      newUserItems = await this.userItemModel.insertMany(newUserItems, { session });

      // Xử lý user room
      let newUserRoom: any = {
        userId: new Types.ObjectId(userId),
        roomId: room._id,
        isCurrent: true,  // mặc định cho user chọn room này luôn
        decorations: {}
      };
      //cho các room khác về false
      await this.userRoomModel.updateMany(
        { userId: userId },
        { $set: { isCurrent: false } },
        { session }
      )

      const slotKeys = Object.keys(room.slots || {});
      for (const slotKey of slotKeys) {
        const defaultItemId = room.slots[slotKey]?.defaultItemId;
        if (!defaultItemId) continue;

        const userItem = newUserItems.find(ui => ui.itemId.toString() === defaultItemId.toString());
        if (userItem) {
          newUserRoom.decorations[slotKey] = userItem._id;
        }
      }

      // Thêm user room
      const createdUserRooms = await this.userRoomModel.create([newUserRoom], { session });
      newUserRoom = createdUserRooms[0];

      await session.commitTransaction();

      return {
        room: room,
        userRoom: newUserRoom,
        items: items,
        userItems: newUserItems
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async changeIsCurrentRoom(
    userId: string,
    userRoomId: string
  ): Promise<void> {
    // chuyển tấc cả room về false
    await this.userRoomModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { $set: { isCurrent: false } }
    );

    // chuyển phòng hiện tại thành true
    await this.userRoomModel.updateOne(
      { _id: new Types.ObjectId(userRoomId) },
      { $set: { isCurrent: true } }
    )
  }
}
