import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import envConfiguration from './config/env-configuration';
import { mongooseModuleAsyncOptions } from './db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [envConfiguration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
