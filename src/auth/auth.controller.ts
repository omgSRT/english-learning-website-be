import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from '../common/dto/signup.dto';
import { Account } from '../accounts/entities/account.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../common/decorator/user.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: any) {
    return await this.authService.changePassword(dto, user);
  }
}
