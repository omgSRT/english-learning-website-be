import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flashcard, FlashcardSchema } from './entities/flashcard.entity';
import { FlashcardSetsModule } from 'src/flashcard-sets/flashcard-sets.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    FlashcardSetsModule,
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
