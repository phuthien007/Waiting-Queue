import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
import { UserDto } from 'src/users/dto/user.dto';

/**
 * Event DTO class for event response body and request body (create, update)
 */
export class EventDto {
  @ApiPropertyOptional()
  @Expose()
  id: string;

  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  createdAt: Date;
  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  updatedAt: Date;

  @ApiPropertyOptional()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  from: Date;

  @ApiPropertyOptional()
  @Expose()
  to: Date;

  @ApiPropertyOptional()
  @Expose()
  note: string;

  @ApiPropertyOptional()
  @Expose()
  place: string;

  @ApiPropertyOptional()
  @Expose()
  drawImagePath: string;

  @ApiPropertyOptional()
  @Expose()
  daily: boolean;

  @ApiPropertyOptional()
  @Expose()
  description: string;

  @Expose()
  @ApiPropertyOptional()
  status: boolean;

  // relations
  @ApiPropertyOptional()
  @Expose()
  // transform tenant to tenantDto when return response body to client
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
