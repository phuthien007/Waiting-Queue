import { UserDto } from './user.dto';

// interface UserMeDto contain all field of UserDto and a field isOwnerTenant has type boolean
export class UserMeDto extends UserDto {
  isOwnerTenant: boolean;
}
