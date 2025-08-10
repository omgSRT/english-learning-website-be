import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;
}
