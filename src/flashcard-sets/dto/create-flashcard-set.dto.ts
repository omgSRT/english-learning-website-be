import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardSetDto {
  @ApiProperty({
    example: 'Flashcard Set Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Description Of Flashcard Title',
  })
  @IsString()
  description?: string;
}
