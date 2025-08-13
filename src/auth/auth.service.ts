import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { Account } from '../accounts/entities/account.entity';
import { SignupDto } from '../common/dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  async changePassword(dto: ChangePasswordDto, user: any) {
    const account = await this.accountService.findOneWithoutOmittedField(
      user.accountId,
    );
    if (!account) throw new NotFoundException('Account Not Found');

    const isPasswordMatched = await bcrypt.compare(
      dto.oldPassword,
      account.password,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('Old Password Is Not Matched');
    }

    const isNewPasswordMatched = dto.newPassword === dto.confirmNewPassword;
    if (!isNewPasswordMatched) {
      throw new BadRequestException(
        'Confirm Password And New Password Are Not Matched',
      );
    }

    const result = await this.accountService.updateAccountPassword(
      user.accountId,
      dto.newPassword,
    );
    if (!result) {
      throw new InternalServerErrorException('Password Cannot Be Updated');
    }

    return result;
  }
}
