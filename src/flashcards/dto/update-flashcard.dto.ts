import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFlashcardDto {
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
