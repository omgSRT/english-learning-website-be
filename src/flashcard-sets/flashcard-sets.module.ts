import { Module } from '@nestjs/common';
import { FlashcardSetsService } from './flashcard-sets.service';
import { FlashcardSetsController } from './flashcard-sets.controller';
import {
  FlashcardSet,
  FlashcardSetSchema,
} from './entities/flashcard-set.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashcardSet.name, schema: FlashcardSetSchema },
    ]),
  ],
  controllers: [FlashcardSetsController],
  providers: [FlashcardSetsService],
  exports: [FlashcardSetsService],
})
export class FlashcardSetsModule {}
