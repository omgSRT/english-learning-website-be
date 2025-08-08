import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from '../types/payload.type';
import { authConstants } from '../constant/auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? authConstants.jwtSecret,
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
