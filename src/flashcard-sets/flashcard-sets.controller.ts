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
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('flashcard-sets')
export class FlashcardSetsController {
  constructor(private readonly flashcardSetsService: FlashcardSetsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(
    @Body() createFlashcardSetDto: CreateFlashcardSetDto,
    @User() user: any,
  ) {
    return this.flashcardSetsService.create(createFlashcardSetDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.flashcardSetsService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.flashcardSetsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/like/add')
  async addLike(@Param('id') id: string) {
    return await this.flashcardSetsService.addLike(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/like/remove')
  async removeLike(@Param('id') id: string) {
    return await this.flashcardSetsService.removeLike(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    return await this.flashcardSetsService.remove(id, user);
  }
}
