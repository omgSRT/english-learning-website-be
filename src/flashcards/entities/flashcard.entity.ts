import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FlashcardDocument = HydratedDocument<Flashcard>;

@Schema({ timestamps: true })
export class Flashcard {
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
