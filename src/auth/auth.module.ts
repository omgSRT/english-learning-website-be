import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/accounts/accounts.module';
import { authConstants } from './constant/auth.constant';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    AccountsModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ?? authConstants.jwtSecret,
        signOptions: {
          expiresIn: authConstants.jwtExpiresIn,
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
