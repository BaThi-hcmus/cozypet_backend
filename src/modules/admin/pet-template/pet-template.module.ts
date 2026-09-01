import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetTemplateService } from './pet-template.service';
import { PetTemplateController } from './pet-template.controller';
import { PetTemplateGeminiService } from './pet-template-gemini.service';
import { ToolBarModule } from 'src/shared/toolbar/toolbar.module';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { PetTemplate, PetTemplateSchema } from './schemas/pet-template.schema';

@Module({
  imports: [
    ToolBarModule,
    MongooseModule.forFeature([
      { name: PetTemplate.name, schema: PetTemplateSchema },
    ]),
  ],
  controllers: [PetTemplateController],
  providers: [PetTemplateService, PetTemplateGeminiService, CloudinaryService],
  exports: [PetTemplateService],
})
export class PetTemplateModule {}
