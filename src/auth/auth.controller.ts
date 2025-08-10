import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from '../common/dto/signup.dto';
import { Account } from '../accounts/entities/account.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto): Promise<Partial<Account>> {
    return await this.authService.signUp(signupDto);
  }
}
