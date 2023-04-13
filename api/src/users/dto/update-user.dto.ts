import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  resetTokenPassword: string;

  resetDatePassword: Date;

  tenantId: number;
  queueIds: number[];
}
