import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashcardSetsService } from './flashcard-sets.service';
import { CreateFlashcardSetDto } from './dto/create-flashcard-set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard-set.dto';

@Controller('flashcard-sets')
export class FlashcardSetsController {
  constructor(private readonly flashcardSetsService: FlashcardSetsService) {}

  @Post()
  create(@Body() createFlashcardSetDto: CreateFlashcardSetDto) {
    return this.flashcardSetsService.create(createFlashcardSetDto);
  }

  @Get()
  findAll() {
    return this.flashcardSetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardSetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashcardSetDto: UpdateFlashcardSetDto) {
    return this.flashcardSetsService.update(+id, updateFlashcardSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardSetsService.remove(+id);
  }
}
