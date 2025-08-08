import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/accounts/accounts.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  //might add login by email option later
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const foundAccountByUsername = await this.accountService.findOneByUsername(
      loginDto.username,
    );
    if (!foundAccountByUsername) {
      throw new UnauthorizedException('Account Not Found');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      foundAccountByUsername.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Wrong Password');
    }

    const payload = {
      accountId: foundAccountByUsername._id,
      username: foundAccountByUsername.username,
      email: foundAccountByUsername.email,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
