import { Test, TestingModule } from '@nestjs/testing';
import { PetTemplateService } from './pet-template.service';

describe('PetTemplateService', () => {
  let service: PetTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetTemplateService],
    }).compile();

    service = module.get<PetTemplateService>(PetTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
