import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { commonEnum } from 'src/common/enum';

export class CreateTenantDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  tenantCode: string;

  @IsString()
  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  address: string;

  @IsString()
  @ApiPropertyOptional()
  website: string;

  @IsString()
  @ApiPropertyOptional()
  contactPhone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional()
  contactEmail: string;

  @IsEnum(commonEnum, {
    message: `Status must be in ${Object.values(commonEnum).join(', ')}`,
  })
  @ApiPropertyOptional({
    default: commonEnum.ACTIVE,
  })
  status: boolean;

  @IsString()
  @ApiPropertyOptional()
  note: string;
}
