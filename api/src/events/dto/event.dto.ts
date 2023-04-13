import { BaseDto } from 'src/common/base.dto';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class EventDto extends BaseDto {
  name: string;
  from: Date;
  to: Date;
  note: string;
  place: string;
  drawImagePath: string;
  daily: boolean;
  description: string;
  status: boolean;
  // relations
  tenant: TenantDto;
  user: UserDto;
}
