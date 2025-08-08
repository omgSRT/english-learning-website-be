import { Module } from '@nestjs/common';
import { FlashcardSetsService } from './flashcard-sets.service';
import { FlashcardSetsController } from './flashcard-sets.controller';

@Module({
  controllers: [FlashcardSetsController],
  providers: [FlashcardSetsService],
})
export class FlashcardSetsModule {}
