import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PetTemplate, PetTemplateSchema } from 'src/modules/admin/pet-template/schemas/pet-template.schema';
import { PetGeminiService } from './pet-gemini.service';
import { Pet, PetSchema } from 'src/modules/admin/pet/schemas/pet.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PetTemplate.name, schema: PetTemplateSchema },
      { name: Pet.name, schema: PetSchema }
    ]),
    ConfigModule,
  ],
  controllers: [PetController],
  providers: [PetService, PetGeminiService],
})
export class PetModule { }
