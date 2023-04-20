import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiPropertyOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiPropertyOptional({
    description: 'Type a new password',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
    },
  )
  newPassword: string;

  @ApiPropertyOptional({
    description: 'Type password again',
  })
  replyPassword: string;
}
