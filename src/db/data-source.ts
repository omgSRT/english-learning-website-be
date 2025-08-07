import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri:
      configService.get<string>('MONGODB_URI') ||
      'mongodb://localhost:27017/english-learning',
    retryAttempts: 3,
    onConnectionCreate: (connection) => {
      console.log('MongoDB Atlas Connected');
      return connection;
    },
  }),
};
