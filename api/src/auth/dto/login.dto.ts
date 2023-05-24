import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Login DTO class for login request body
 */
export class LoginDto {
  /**
   * Tenant code of the tenant
   */
  @ApiProperty()
  @IsNotEmpty({
    message: 'Mã công ty không được trống',
  })
  tenantCode: string;

  /**
   * Email of the user
   */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({
    message: 'Email không được trống',
  })
  email: string;

  /**
   * Password of the user
   */
  @ApiProperty()
  @IsNotEmpty({
    message: 'Mật khẩu không được trống',
  })
  password: string;

  /**
   * Recaptcha token
   * @example 03AGdBq24XQY7...
   */

  @ApiProperty()
  @IsNotEmpty({
    message: 'Recaptcha token không được trống',
  })
  token: string;
}
