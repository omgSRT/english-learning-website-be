import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FlashcardSetDocument = HydratedDocument<FlashcardSet>;

@Schema({ timestamps: true })
export class FlashcardSet {
  @Prop({
    required: true,
  })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
  })
  likes: number;

  @Prop()
  avatarUrl?: string;

  @Prop({ types: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlashcardSet' }],
  })
  flashcards: mongoose.Types.ObjectId[];
}

export const FlashcardSetSchema = SchemaFactory.createForClass(FlashcardSet);
