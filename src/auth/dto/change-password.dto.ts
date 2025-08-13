import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'old-password',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'new-password',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'confirm-new-password',
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
