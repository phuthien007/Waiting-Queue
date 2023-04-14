import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Exclude,
  Expose,
  Transform,
  TransformInstanceToInstance,
  Type,
} from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { RoleEnum } from 'src/common/enum';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
import { Tenant } from 'src/tenants/entities/tenants.entity';

export class UserDto extends BaseDto {
  @ApiPropertyOptional()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  fullName: string;

  @Expose()
  @ApiPropertyOptional({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.OPERATOR,
  })
  status: boolean;

  @Expose()
  @ApiPropertyOptional()
  note: string;

  @Expose()
  @Exclude()
  password: string;

  @Expose()
  @ApiPropertyOptional({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.OPERATOR,
  })
  role: string;

  @Expose()
  @ApiPropertyOptional()
  isWorking: boolean;

  @Expose()
  @ApiPropertyOptional()
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
  // @Type(() => TenantDto)
  tenant: TenantDto;

  @Expose()
  @Exclude()
  resetTokenPassword: Date;
}
