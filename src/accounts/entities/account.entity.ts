import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  avatarUrl?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlashcardSet' }],
  })
  flashcardSets: mongoose.Types.ObjectId[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
