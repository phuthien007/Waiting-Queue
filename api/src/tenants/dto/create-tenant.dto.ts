import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { commonEnum } from 'src/common/enum';

export class CreateTenantDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  tenantCode: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsString()
  website: string;

  @IsString()
  contactPhone: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsEnum(commonEnum)
  status: boolean;

  @IsString()
  note: string;
}
