import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PetTemplate, PetTemplateDocument } from './schemas/pet-template.schema';
import { CreatePetTemplateDto } from './dtos/create.pet-template.dto';
import { UpdatePetTemplateDto } from './dtos/update.pet-template.dto';
import { BulkPetTemplateActionDto } from './dtos/bulk.pet-template.dto';
import { FilterStatus } from 'src/utils/filterStatus.util';
import { Search } from 'src/utils/search.util';
import { Pagination } from 'src/utils/pagination.util';
import { Sort } from 'src/utils/sort.util';
import { AdminPetGeminiService } from './admin.pet-template-gemini.service';
import { instanceToPlain } from 'class-transformer';
import { UploadedImageFile } from './interfaces/uploadedImageFile.interface';

@Injectable()
export class AdminPetService {
  constructor(
    @InjectModel(PetTemplate.name)
    private readonly petTemplateModel: Model<PetTemplateDocument>,
    private readonly filterStatusService: FilterStatus,
    private readonly searchService: Search,
    private readonly paginationService: Pagination,
    private readonly sortService: Sort,
    private readonly petTemplateGeminiService: AdminPetGeminiService,
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

    const statusList = [
      { name: 'Tất cả', status: '', class: 'active' },
      { name: 'Hoạt động', status: 'active', class: '' },
      { name: 'Dừng hoạt động', status: 'inactive', class: '' },
    ];
    this.filterStatusService.filterStatus(status, statusList, queryCondition);

    const fieldSearch = ['templateId', 'name', 'species', 'primaryColor', 'coatPattern'];
    this.searchService.search(keyword, fieldSearch, queryCondition);

    const sortList = [
      { name: 'Tên tăng dần', type: 'name-asc' },
      { name: 'Tên giảm dần', type: 'name-desc' },
      { name: 'Loài A-Z', type: 'species-asc' },
      { name: 'Loài Z-A', type: 'species-desc' },
      { name: 'Mới nhất', type: 'createdAt-desc' },
      { name: 'Cũ nhất', type: 'createdAt-asc' },
    ];
    const sortCondition = this.sortService.sort(sortType, sortList);

    const paginationObj = await this.paginationService.pagination(
      page,
      queryCondition,
      this.petTemplateModel,
    );

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

    const petTemplates = await this.petTemplateModel
      .find(queryCondition)
      .sort(sortCondition)
      .skip(paginationObj.startIndex)
      .limit(paginationObj.itemPerPage);

    return {
      petTemplates,
      statusList,
      keyword,
      sortType,
      sortList,
      paginationObj,
      bulkActions,
    };
  }

  async createPetTemplate(
    createPetTemplateDto: CreatePetTemplateDto,
    imageFile: UploadedImageFile,
  ): Promise<void> {
    if (!createPetTemplateDto.avatar) {
      throw new BadRequestException('Ảnh avatar không được để trống');
    }

    const existTemplate = await this.petTemplateModel.findOne({
      templateId: createPetTemplateDto.templateId,
      deleted: false,
    });
    if (existTemplate) {
      throw new ConflictException('Mã template đã tồn tại trong hệ thống');
    }

    const characteristics = await this.petTemplateGeminiService.analyzePetAvatar(
      imageFile.buffer,
      imageFile.mimetype,
      createPetTemplateDto.species as 'dog' | 'cat',
    );

    // biến toàn bộ DTO thành object thuần của JS
    const plainData = instanceToPlain(createPetTemplateDto);
    const newPetTemplate = new this.petTemplateModel({
      ...plainData,
      ...characteristics,
    });
    await newPetTemplate.save();
  }

  async updatePetTemplate(
    id: string,
    updatePetTemplateDto: UpdatePetTemplateDto,
    imageFile?: UploadedImageFile,
  ): Promise<void> {
    const petTemplateExist = await this.petTemplateModel.findOne({
      _id: id,
      deleted: false,
    });
    if (!petTemplateExist) {
      throw new NotFoundException('Mẫu pet không tồn tại trong hệ thống');
    }

    // Nếu đổi template id thì phải kiểm tra trùng
    if (
      updatePetTemplateDto.templateId &&
      updatePetTemplateDto.templateId !== petTemplateExist.templateId
    ) {
      const existTemplate = await this.petTemplateModel.findOne({
        templateId: updatePetTemplateDto.templateId,
        deleted: false,
      });
      if (existTemplate) {
        throw new ConflictException('Mã template đã tồn tại trong hệ thống');
      }
    }

    const nextSpecies =
      (updatePetTemplateDto.species as 'dog' | 'cat' | undefined) ||
      (petTemplateExist.species as 'dog' | 'cat');

    let characteristics = {};

    // Nếu upload ảnh mới
    if (imageFile) {
      // phân tích ảnh mới
      characteristics = await this.petTemplateGeminiService.analyzePetAvatar(
        imageFile.buffer,
        imageFile.mimetype,
        nextSpecies,
      );
    } else if ( // giữ nguyên ảnh cũ nhưng đổi loài
      updatePetTemplateDto.species &&
      updatePetTemplateDto.species !== petTemplateExist.species
    ) {
      const { buffer, mimeType } = await this.petTemplateGeminiService.fetchImageBuffer(
        updatePetTemplateDto.avatar || petTemplateExist.avatar,
      );
      characteristics = await this.petTemplateGeminiService.analyzePetAvatar(
        buffer,
        mimeType,
        nextSpecies,
      );
    }

    await this.petTemplateModel.updateOne(
      { _id: id },
      {
        ...updatePetTemplateDto,
        ...characteristics,
      },
    );
  }

  async detailPetTemplate(id: string): Promise<PetTemplateDocument> {
    const petTemplate = await this.petTemplateModel.findOne({
      _id: id,
      deleted: false,
    });
    if (!petTemplate) {
      throw new NotFoundException('Mẫu pet không tồn tại');
    }
    return petTemplate;
  }

  async deletePetTemplate(id: string): Promise<void> {
    const petTemplateExist = await this.petTemplateModel.findOne({
      _id: id,
      deleted: false,
    });
    if (!petTemplateExist) {
      throw new NotFoundException('Mẫu pet cần xóa không tồn tại');
    }

    await this.petTemplateModel.updateOne({ _id: id }, { deleted: true });
  }

  async bulkPetTemplate(bulkPetTemplateActionDto: BulkPetTemplateActionDto): Promise<void> {
    if (!bulkPetTemplateActionDto.ids || bulkPetTemplateActionDto.ids.length === 0) {
      throw new ConflictException('Không tồn tại id của các bản ghi cần cập nhật');
    }

    const existCount = await this.petTemplateModel.countDocuments({
      _id: { $in: bulkPetTemplateActionDto.ids },
    });
    if (existCount !== bulkPetTemplateActionDto.ids.length) {
      throw new BadRequestException('Có một id không tồn tại trong hệ thống');
    }

    await this.petTemplateModel.updateMany(
      { _id: { $in: bulkPetTemplateActionDto.ids } },
      bulkPetTemplateActionDto.payload,
    );
  }
}
