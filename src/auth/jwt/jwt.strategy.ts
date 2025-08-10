import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from '../types/payload.type';
import { authConstants } from '../constant/auth.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwtSecret') ?? authConstants.jwtSecret,
    });
  }

  async validate(payload: PayloadType) {
    return {
      accountId: payload.accountId,
      username: payload.username,
      email: payload.email,
    };
  }
}
