import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    required: true,
  })
  content: string;

  @Prop({ types: mongoose.Schema.Types.ObjectId, ref: 'FlashcardSet' })
  flashcardSet: mongoose.Types.ObjectId;

  @Prop({ types: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: mongoose.Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
