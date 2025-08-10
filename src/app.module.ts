import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import envConfiguration from './config/env-configuration';
import { mongooseModuleAsyncOptions } from './db/data-source';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { FlashcardSetsModule } from './flashcard-sets/flashcard-sets.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [envConfiguration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    AccountsModule,
    AuthModule,
    FlashcardSetsModule,
    FlashcardsModule,
    FlashcardSetsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
