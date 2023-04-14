import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  tenantCode: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
