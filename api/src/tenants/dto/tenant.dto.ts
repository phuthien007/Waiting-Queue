import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class TenantDto extends BaseDto {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional()
  tenantCode: string;
  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  website: string;

  @ApiPropertyOptional()
  contactPhone: string;

  @ApiPropertyOptional()
  contactEmail: string;

  @ApiPropertyOptional()
  status: boolean;

  @ApiPropertyOptional()
  note: string;
}
