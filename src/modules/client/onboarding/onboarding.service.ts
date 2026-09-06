import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from 'src/modules/admin/pet/schemas/pet.schema';
import { CreatePetDto } from './dtos/create.pet.dto';

@Injectable()
export class OnboardingService {
    constructor(
        @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>
    ) {}

    async createInitialPet(guestId: string, createPetDto: CreatePetDto): Promise<void> {
        if (!guestId) {
            throw new ConflictException('Không nhận được guest Id');
        }

        await this.petModel.create({
            userId: guestId,
            ...createPetDto
        });
    }
}
