import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { User } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createFlashcardDto: CreateFlashcardDto, @User() user: any) {
    return this.flashcardsService.create(createFlashcardDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.flashcardsService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashcardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ) {
    return this.flashcardsService.update(id, updateFlashcardDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(id);
  }
}
