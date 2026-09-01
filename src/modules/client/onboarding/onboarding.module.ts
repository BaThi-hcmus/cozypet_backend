import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from 'src/modules/admin/pet/schemas/pet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Pet.name, schema: PetSchema}
    ])
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
