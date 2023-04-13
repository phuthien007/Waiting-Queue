import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { RoleEnum, commonEnum } from 'src/common/enum';

export class CreateUserDto extends BaseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(commonEnum)
  status: boolean;

  @IsString()
  note: string;

  @IsEnum(RoleEnum)
  role: string;

  @IsBoolean()
  isWorking: boolean;
}
