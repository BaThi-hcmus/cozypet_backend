import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemDto } from './dtos/create.item.dto';
import { UpdateItemDto } from './dtos/update.item.dto';
import { BulkItemActionDto } from './dtos/bulk.item.dto';
import { FilterStatus } from 'src/utils/filterStatus.util';
import { Search } from 'src/utils/search.util';
import { Pagination } from 'src/utils/pagination.util';
import { Sort } from 'src/utils/sort.util';
import { ITEM_CONSTANTS_RESPONSE } from 'src/constants/item.constants';

@Injectable()
export class ItemService {
  constructor(
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

    // Tìm kiếm theo name, type, category, slotType
    const fieldSearch = ['name', 'type', 'category', 'slotType'];
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
        name: 'Giá tăng dần',
        type: 'price-asc',
      },
      {
        name: 'Giá giảm dần',
        type: 'price-desc',
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
      this.itemModel,
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

    const items = await this.itemModel
      .find(queryCondition)
      .sort(sortCondition)
      .skip(paginationObj.startIndex)
      .limit(paginationObj.itemPerPage);

    return {
      items: items,
      statusList: statusList,
      keyword: keyword,
      sortType: sortType,
      sortList: sortList,
      paginationObj: paginationObj,
      bulkActions: bulkActions,
    };
  }

  async createItem(createItemDto: CreateItemDto): Promise<void> {
    const newItem = new this.itemModel(createItemDto);
    await newItem.save();
  }

  async updateItem(id: string, updateItemDto: UpdateItemDto): Promise<void> {
    const itemExist = await this.itemModel.findOne({ _id: id, deleted: false });
    if (!itemExist) {
      throw new NotFoundException('Vật phẩm không tồn tại trong hệ thống');
    }

    await this.itemModel.updateOne({ _id: id }, updateItemDto);
  }

  async detailItem(id: string): Promise<ItemDocument> {
    const item = await this.itemModel.findOne({ _id: id, deleted: false });
    if (!item) {
      throw new NotFoundException('Vật phẩm không tồn tại');
    }
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    const itemExist = await this.itemModel.findOne({ _id: id, deleted: false });
    if (!itemExist) {
      throw new NotFoundException('Vật phẩm cần xóa không tồn tại');
    }

    await this.itemModel.updateOne({ _id: id }, { deleted: true });
  }

  async bulkItem(bulkItemActionDto: BulkItemActionDto): Promise<void> {
    if (!bulkItemActionDto.ids || bulkItemActionDto.ids.length === 0) {
      throw new ConflictException('Không tồn tại id của các bản ghi cần cập nhật');
    }

    const existCount = await this.itemModel.countDocuments({
      _id: { $in: bulkItemActionDto.ids },
    });
    if (existCount !== bulkItemActionDto.ids.length) {
      throw new BadRequestException('Có một id không tồn tại trong hệ thống');
    }

    await this.itemModel.updateMany(
      { _id: { $in: bulkItemActionDto.ids } },
      bulkItemActionDto.payload,
    );
  }

  getItemConstants() {
    return {
      data: ITEM_CONSTANTS_RESPONSE,
      message: 'Lấy cấu hình item constants thành công',
    };
  }
}
