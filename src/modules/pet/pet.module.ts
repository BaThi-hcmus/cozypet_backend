import { Module } from '@nestjs/common';
import { AdminPetService } from './admin.pet-template.service';
import { AdminPetController } from './admin.pet-template.controller';
import { AdminPetGeminiService } from './admin.pet-template-gemini.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PetTemplate, PetTemplateSchema } from './schemas/pet-template.schema';
import { Pet, PetSchema } from './schemas/pet.schema';
import { ConfigModule } from '@nestjs/config';
import { ClientPetController } from './client.pet.controller';
import { ClientPetService } from './client.pet.service';
import { ClientPetGeminiService } from './client.pet-gemini.service';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PetTemplate.name, schema: PetTemplateSchema },
      { name: Pet.name, schema: PetSchema }
    ]),
    ConfigModule,
    CloudinaryModule,
    ToolBarModule
  ],
  controllers: [AdminPetController, ClientPetController],
  providers: [
    AdminPetService,
    ClientPetService,
    AdminPetGeminiService,
    ClientPetGeminiService,
  ],
  exports: [AdminPetService]
})
export class PetModule { }
