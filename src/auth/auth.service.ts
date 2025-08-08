import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/accounts/accounts.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { Account } from 'src/accounts/entities/account.entity';
import { SignupDto } from 'src/common/dto/signup.dto';

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

  async signUp(signupDto: SignupDto): Promise<Partial<Account>> {
    const foundAccountByEmail = await this.accountService.findOneByEmail(
      signupDto.email,
    );
    if (foundAccountByEmail) {
      throw new BadRequestException('Account With This Email Already Exists');
    }

    const foundAccountByUsername = await this.accountService.findOneByUsername(
      signupDto.username,
    );
    if (foundAccountByUsername) {
      throw new BadRequestException(
        'Account With This Username Already Exists',
      );
    }

    if (signupDto.password !== signupDto.confirmPassword) {
      throw new BadRequestException('Passwords Do Not Match');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);
    signupDto.password = hashedPassword;
    const newAccount =
      await this.accountService.createAccountFromSignup(signupDto);
    if (!newAccount) {
      throw new InternalServerErrorException('Account Creation Failed');
    }

    const { password, ...newAccountWithoutPassword } = newAccount;
    return newAccountWithoutPassword;
  }
}
