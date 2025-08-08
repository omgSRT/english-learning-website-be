import { Injectable } from '@nestjs/common';
import { CreateFlashcardSetDto } from './dto/create-flashcard-set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard-set.dto';

@Injectable()
export class FlashcardSetsService {
  create(createFlashcardSetDto: CreateFlashcardSetDto) {
    return 'This action adds a new flashcardSet';
  }

  findAll() {
    return `This action returns all flashcardSets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashcardSet`;
  }

  update(id: number, updateFlashcardSetDto: UpdateFlashcardSetDto) {
    return `This action updates a #${id} flashcardSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashcardSet`;
  }
}
