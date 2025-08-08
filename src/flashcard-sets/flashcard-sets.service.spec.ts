import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetsService } from './flashcard-sets.service';

describe('FlashcardSetsService', () => {
  let service: FlashcardSetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardSetsService],
    }).compile();

    service = module.get<FlashcardSetsService>(FlashcardSetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
