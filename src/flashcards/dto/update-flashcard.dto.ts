import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @ApiProperty({
    example: 'vocabulary',
  })
  @IsString()
  @IsNotEmpty()
  flashcardType: string;

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
}
