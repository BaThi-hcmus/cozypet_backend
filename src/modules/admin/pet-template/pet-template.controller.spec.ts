import { Test, TestingModule } from '@nestjs/testing';
import { PetTemplateController } from './pet-template.controller';
import { PetTemplateService } from './pet-template.service';

describe('PetTemplateController', () => {
  let controller: PetTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetTemplateController],
      providers: [PetTemplateService],
    }).compile();

    controller = module.get<PetTemplateController>(PetTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
