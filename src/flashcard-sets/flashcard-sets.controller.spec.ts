import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardSetsController } from './flashcard-sets.controller';
import { FlashcardSetsService } from './flashcard-sets.service';

describe('FlashcardSetsController', () => {
  let controller: FlashcardSetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardSetsController],
      providers: [FlashcardSetsService],
    }).compile();

    controller = module.get<FlashcardSetsController>(FlashcardSetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
