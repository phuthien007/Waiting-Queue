import { ApiProperty } from '@nestjs/swagger';

/**
 * Login DTO class for login request body
 */
export class LoginDto {
  /**
   * Tenant code of the tenant
   */
  @ApiProperty()
  tenantCode: string;

  /**
   * Email of the user
   */
  @ApiProperty()
  email: string;

  /**
   * Password of the user
   */
  @ApiProperty()
  password: string;
}
