import { BaseDto } from 'src/common/base.dto';

export class UserDto extends BaseDto {
  email: string;

  password: string;

  fullName: string;

  status: boolean;

  note: string;

  role: string;

  isWorking: boolean;

  tenantId: number;
}
