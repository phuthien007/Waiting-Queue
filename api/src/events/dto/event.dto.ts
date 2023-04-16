import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class EventDto extends BaseDto {
  @ApiPropertyOptional()
  @Expose()
  name: string;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  from: Date;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  to: Date;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  note: string;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  place: string;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  drawImagePath: string;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  daily: boolean;
  @Expose()
  @ApiPropertyOptional()
  @Expose()
  description: string;
  @Expose()
  @ApiPropertyOptional()
  status: boolean;
  @ApiPropertyOptional()
  // relations
  @ApiPropertyOptional()
  @Expose()
  @Transform(({ obj }) => {
    // transform tenant to tenantDto
    if (obj.tenant) {
      return {
        id: obj.tenant.id,
        name: obj.tenant.name,
      };
    }
    return null;
  })
  tenant: TenantDto;
  @Exclude()
  @ApiPropertyOptional()
  user: UserDto;
}
