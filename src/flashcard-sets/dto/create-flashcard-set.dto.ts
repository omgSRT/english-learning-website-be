import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class FlashcardDto {
  @ApiProperty({
    example: 'Algorithm',
    description: 'The term or word to be learned',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    example: 'A process or set of rules to be followed in calculations',
    description: 'The definition or explanation of the term',
  })
  @IsString()
  @IsNotEmpty()
  definition: string;
}

export class CreateFlashcardSetDto {
  @ApiProperty({
    example: 'Programming Basics',
    description: 'The title of the flashcard set',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A set of flashcards to learn basic programming concepts',
    description: 'Optional description of the flashcard set',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    type: () => [FlashcardDto], // Specify the type as an array of FlashcardDto
    example: [
      {
        term: 'Algorithm',
        definition: 'A process or set of rules to be followed in calculations',
      },
      {
        term: 'Variable',
        definition: 'A named storage location in memory',
      },
    ],
    description: 'An array of flashcards belonging to this set',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlashcardDto)
  flashcards: FlashcardDto[];
}
