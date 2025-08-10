import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FlashcardTypeEnum } from './enum/flashcard.enum';

export type FlashcardDocument = HydratedDocument<Flashcard>;

@Schema({ timestamps: true })
export class Flashcard {
  @Prop({ required: true, default: FlashcardTypeEnum.VOCABULARY })
  flashcardType: string;

  @Prop({
    required: true,
  })
  term: string;

  @Prop({
    required: true,
  })
  definition: string;

  @Prop({ types: mongoose.Schema.Types.ObjectId, ref: 'FlashcardSet' })
  flashcardSet: mongoose.Types.ObjectId;
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
