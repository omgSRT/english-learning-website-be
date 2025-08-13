import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateFlashcardDto {
  @ApiProperty({
    example: 'An English Word',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    example: 'Definition Of An English Word',
  })
  @IsString()
  @IsNotEmpty()
  definition: string;

  @ApiProperty({
    example: new mongoose.Types.ObjectId().toHexString(),
  })
  @IsString()
  @IsNotEmpty()
  flashcardSetId: string;
}
