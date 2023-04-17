import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

/**
 * CreateUserDto class for create user DTO object from request body
 */
export class CreateUserDto extends BaseDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional()
  email: string;

  @IsString()
  @ApiPropertyOptional()
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
    },
  )
  password: string;

  @IsString()
  @ApiPropertyOptional()
  fullName: string;

  @IsEnum(commonEnum, {
    message: `Status must be in ${Object.values(commonEnum).join(', ')}`,
  })
  @ApiPropertyOptional({
    type: 'enum',
    enum: commonEnum,
    default: commonEnum.ACTIVE,
  })
  status: boolean;

  @IsString()
  @ApiPropertyOptional()
  note: string;

  @IsEnum(RoleEnum)
  @ApiPropertyOptional({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.OPERATOR,
  })
  role: string;

  @IsBoolean()
  @ApiPropertyOptional()
  isWorking: boolean;

  @IsString()
  @ApiPropertyOptional()
  @IsNotEmpty({
    message: 'Mã công ty không được để trống',
  })
  tenantCode: string;
}
