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
  @IsNotEmpty()
  tenantCode: string;

  /**
   * Email of the user
   */
  @ApiProperty()
  @IsEmail()
  email: string;

  /**
   * Password of the user
   */
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
