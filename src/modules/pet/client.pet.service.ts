import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UploadedImageFile } from './interfaces/uploadedImageFile.interface';
import { ClientPetGeminiService } from './client.pet-gemini.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from './schemas/pet.schema';
import { PetTemplate, PetTemplateDocument } from './schemas/pet-template.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UpdatePetDto } from './dtos/update.pet.dto';

@Injectable()
export class ClientPetService {
  constructor(
    private readonly petGeminiService: ClientPetGeminiService,
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
    @InjectModel(PetTemplate.name) private readonly petTemplateModel: Model<PetTemplateDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) { }

  async summonPetForUser(
    userId: string,
    imageFile: UploadedImageFile
  ): Promise<any> {
    if (!imageFile) {
      throw new BadRequestException('Vui lòng cung cấp ảnh pet');
    }

    // Kiểm tra user có tồn tại không
    const user = await this.userModel.findOne({
      _id: userId,
      deleted: false
    })
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
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

    // Đảm bảo chỉ có 1 pet isCurrent cho 1 user tại 1 thời điểm
    // Đặt tất cả pet cũ của user này thành isCurrent = false trước khi tạo mới
    await this.petModel.updateMany(
      { userId: userId, isCurrent: true, deleted: false },
      { $set: { isCurrent: false } }
    );

    // lưu vào cơ sở dữ liệu với status mặc định
    const newPet = await this.petModel.create({
      userId: userId,
      petTemplateId: petTemplateId,
      isCurrent: true,
      status: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        isSleeping: false,
        lastUpdated: new Date()
      }
    })

    // trả ra thông tin để vẽ pet ra giao diện
    return {
      pet: newPet,
      templatePet: petTemplateExist
    }
  }

  async summonPetForGuest(
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

    // Lấy ra pet template tương ứng
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

  async getMyCurrentPet(
    userId: string
  ): Promise<any> {
    const pet = await this.petModel.findOne({
      userId: userId,
      isCurrent: true,
      deleted: false
    })
    if (!pet) {
      throw new NotFoundException('Không tìm thấy pet');
    }

    // lấy ra pet template
    const petTemplate = await this.petTemplateModel.findOne({
      _id: pet.petTemplateId,
      deleted: false
    })
    if (!petTemplate) {
      throw new NotFoundException('Không tìm thấy pet template');
    }

    return {
      pet,
      petTemplate
    }
  }

  async updatePet(
    petId: string,
    updatePetDto: UpdatePetDto
  ): Promise<any> {
    const pet = await this.petModel.findOne({
      _id: petId,
      deleted: false
    })
    if (!pet) {
      throw new NotFoundException('Không tìm thấy pet');
    }

    // Cập nhật các trường được cung cấp
    if (updatePetDto.name !== undefined) {
      pet.name = updatePetDto.name;
    }
    if (updatePetDto.level !== undefined) {
      pet.level = updatePetDto.level;
    }
    if (updatePetDto.exp !== undefined) {
      pet.exp = updatePetDto.exp;
    }
    if (updatePetDto.status !== undefined) {
      // Merge status hiện tại với status mới, đảm bảo không có undefined
      pet.status = {
        hunger: updatePetDto.status.hunger ?? pet.status.hunger,
        energy: updatePetDto.status.energy ?? pet.status.energy,
        happiness: updatePetDto.status.happiness ?? pet.status.happiness,
        isSleeping: updatePetDto.status.isSleeping ?? pet.status.isSleeping,
        lastUpdated: updatePetDto.status.lastUpdated ?? pet.status.lastUpdated
      };
    }

    await pet.save();

    // Lấy pet template để trả về đầy đủ thông tin
    const petTemplate = await this.petTemplateModel.findOne({
      _id: pet.petTemplateId,
      deleted: false
    })

    return {
      pet,
      petTemplate
    }
  }
}
