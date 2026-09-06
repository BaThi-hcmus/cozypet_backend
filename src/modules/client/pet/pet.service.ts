import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadedImageFile } from 'src/modules/admin/pet-template/interfaces/uploadedImageFile.interface';
import { PetGeminiService } from './pet-gemini.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from 'src/modules/admin/pet/schemas/pet.schema';
import { PetTemplate, PetTemplateDocument } from 'src/modules/admin/pet-template/schemas/pet-template.schema';

@Injectable()
export class PetService {
  constructor(
    private readonly petGeminiService: PetGeminiService,
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
    @InjectModel(PetTemplate.name) private readonly petTemplateModel: Model<PetTemplateDocument>
  ) { }

  async summonPetForUser(
    imageFile: UploadedImageFile
  ): Promise<any> {
    if (!imageFile) {
      throw new BadRequestException('Vui lòng cung cấp ảnh pet');
    }

    // gemini phân tích và trả ra id của pet template tương ứng
    const { isValidSpecies, petTemplateId } = await this.petGeminiService.analyzeImage(
      imageFile.buffer,
      imageFile.mimetype
    )

    // Kiểm tra loài có hợp lệ không
    if (!isValidSpecies) {
      throw new BadRequestException('Chỉ chấp nhận ảnh loài chó hoặc mèo');
    }

    // kiểm tra id trên có tồn tại trong hệ thống không
    const petTemplateExist = await this.petTemplateModel.findOne({
      _id: petTemplateId,
      status: 'active',
      deleted: false
    })
    if (!petTemplateExist) {
      throw new InternalServerErrorException('Gemini trả ra id không tồn tại trong hệ thống');
    }

    // trả ra thông tin để vẽ pet ra giao diện
    return petTemplateExist;
  }
}
