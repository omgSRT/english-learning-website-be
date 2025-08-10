import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FlashcardSetsService } from './flashcard-sets.service';
import { CreateFlashcardSetDto } from './dto/create-flashcard-set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard-set.dto';
import { User } from '../common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('flashcard-sets')
export class FlashcardSetsController {
  constructor(private readonly flashcardSetsService: FlashcardSetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createFlashcardSetDto: CreateFlashcardSetDto,
    @User() user: any,
  ) {
    return this.flashcardSetsService.create(createFlashcardSetDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.flashcardSetsService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.flashcardSetsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlashcardSetDto: UpdateFlashcardSetDto,
    @User() user: any,
  ) {
    return await this.flashcardSetsService.update(
      id,
      updateFlashcardSetDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like/add')
  async addLike(@Param('id') id: string) {
    return await this.flashcardSetsService.addLike(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like/remove')
  async removeLike(@Param('id') id: string) {
    return await this.flashcardSetsService.removeLike(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    return await this.flashcardSetsService.remove(id, user);
  }
}
