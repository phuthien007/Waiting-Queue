import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiPropertyOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @Optional()
  email: string;

  @Optional()
  @ApiPropertyOptional()
  @IsString()
  tenantCode: string;

  @Optional()
  @ApiPropertyOptional({
    description: 'Type a new password',
  })
  newPassword: string;

  @Optional()
  @ApiPropertyOptional({
    description: 'Type password again',
  })
  replyPassword: string;
}
