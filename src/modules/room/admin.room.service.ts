import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dtos/create.room.dto';
import { UpdateRoomDto } from './dtos/update.room.dto';
import { BulkRoomActionDto } from './dtos/bulk.room.dto';
import { FilterStatus } from 'src/utils/filterStatus.util';
import { Search } from 'src/utils/search.util';
import { Pagination } from 'src/utils/pagination.util';
import { Sort } from 'src/utils/sort.util';
import { Item, ItemDocument } from '../item/schemas/item.schema';

@Injectable()
export class AdminRoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    private readonly filterStatusService: FilterStatus,
    private readonly searchService: Search,
    private readonly paginationService: Pagination,
    private readonly sortService: Sort,
  ) { }

  async getAll(
    status: string,
    keyword: string,
    page: string,
    sortType: string,
  ): Promise<any> {
    const queryCondition: any = {
      deleted: false,
    };

    // Lọc trạng thái
    const statusList = [
      {
        name: 'Tất cả',
        status: '',
        class: 'active',
      },
      {
        name: 'Hoạt động',
        status: 'active',
        class: '',
      },
      {
        name: 'Dừng hoạt động',
        status: 'inactive',
        class: '',
      },
    ];
    this.filterStatusService.filterStatus(status, statusList, queryCondition);

    // Tìm kiếm theo name, code, description
    const fieldSearch = ['name', 'code', 'description'];
    this.searchService.search(keyword, fieldSearch, queryCondition);

    // Sắp xếp
    const sortList = [
      {
        name: 'Tên tăng dần',
        type: 'name-asc',
      },
      {
        name: 'Tên giảm dần',
        type: 'name-desc',
      },
      {
        name: 'Mới nhất',
        type: 'createdAt-desc',
      },
      {
        name: 'Cũ nhất',
        type: 'createdAt-asc',
      },
    ];
    const sortCondition = this.sortService.sort(sortType, sortList);

    // Phân trang
    const paginationObj = await this.paginationService.pagination(
      page,
      queryCondition,
      this.roomModel,
    );

    // Hành động hàng loạt (Bulk Actions)
    const bulkActions = [
      {
        name: 'Hoạt động',
        value: {
          type: 'status-active',
          payload: { status: 'active' },
        },
      },
      {
        name: 'Dừng hoạt động',
        value: {
          type: 'status-inactive',
          payload: { status: 'inactive' },
        },
      },
      {
        name: 'Xóa',
        value: {
          type: 'delete',
          payload: { deleted: true },
        },
      },
    ];

    const rooms = await this.roomModel
      .find(queryCondition)
      .sort(sortCondition)
      .skip(paginationObj.startIndex)
      .limit(paginationObj.itemPerPage);

    return {
      rooms: rooms,
      statusList: statusList,
      keyword: keyword,
      sortType: sortType,
      sortList: sortList,
      paginationObj: paginationObj,
      bulkActions: bulkActions,
    };
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<void> {
    const existCode = await this.roomModel.findOne({ code: createRoomDto.code, deleted: false });
    if (existCode) {
      throw new ConflictException('Mã phòng đã tồn tại trong hệ thống');
    }

    const newRoom = new this.roomModel(createRoomDto);
    await newRoom.save();
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto): Promise<void> {
    const roomExist = await this.roomModel.findOne({ _id: id, deleted: false });
    if (!roomExist) {
      throw new NotFoundException('Phòng không tồn tại trong hệ thống');
    }

    if (updateRoomDto.code && updateRoomDto.code !== roomExist.code) {
      const existCode = await this.roomModel.findOne({ code: updateRoomDto.code, deleted: false });
      if (existCode) {
        throw new ConflictException('Mã phòng đã tồn tại trong hệ thống');
      }
    }

    await this.roomModel.updateOne({ _id: id }, updateRoomDto);
  }

  async detailRoom(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findOne({ _id: id, deleted: false });
    if (!room) {
      throw new NotFoundException('Phòng không tồn tại');
    }
    return room;
  }

  async deleteRoom(id: string): Promise<void> {
    const roomExist = await this.roomModel.findOne({ _id: id, deleted: false });
    if (!roomExist) {
      throw new NotFoundException('Phòng cần xóa không tồn tại');
    }

    await this.roomModel.updateOne({ _id: id }, { deleted: true });
  }

  async bulkRoom(bulkRoomActionDto: BulkRoomActionDto): Promise<void> {
    if (!bulkRoomActionDto.ids || bulkRoomActionDto.ids.length === 0) {
      throw new ConflictException('Không tồn tại id của các bản ghi cần cập nhật');
    }

    const existCount = await this.roomModel.countDocuments({
      _id: { $in: bulkRoomActionDto.ids },
    });
    if (existCount !== bulkRoomActionDto.ids.length) {
      throw new BadRequestException('Có một id không tồn tại trong hệ thống');
    }

    await this.roomModel.updateMany(
      { _id: { $in: bulkRoomActionDto.ids } },
      bulkRoomActionDto.payload,
    );
  }

  async getRoomByCode(
    roomCode: string
  ): Promise<any> {
    // lấy ra room
    const room = await this.roomModel.findOne({
      code: roomCode,
      status: 'active',
      deleted: false
    })
    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng có roomCode hiện tại');
    }

    // lấy ra các item default của room
    const defaultItemIds = Object.values(room.slots || {})
      .map((slot: any) => slot?.defaultItemId)
      .filter((id) => id != null);

    const items = await this.itemModel.find({
      _id: { $in: defaultItemIds },
      deleted: false,
      status: 'active'
    })

    return {
      room,
      items
    }
  }
}
