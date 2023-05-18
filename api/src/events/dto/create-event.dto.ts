import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { commonEnum } from 'src/common/enum';

/**
 * Create event DTO class for create event request body
 */
export class CreateEventDto {
  @ApiPropertyOptional()
  id: string;

  // @ApiProperty()
  @ApiPropertyOptional({
    default: new Date(),
  })
  createdAt: Date;
  // @ApiProperty()
  @ApiPropertyOptional({
    default: new Date(),
  })
  updatedAt: Date;

  @IsString({
    message: transformError('Tên sự kiện', ERROR_TYPE.REQUIRED),
  })
  @IsNotEmpty()
  @ApiPropertyOptional()
  name: string;

  @IsDateString()
  @ApiPropertyOptional()
  from: Date;

  @IsDateString()
  @ApiPropertyOptional()
  to: Date;

  @IsString()
  @ApiPropertyOptional()
  note: string;

  @IsString()
  @ApiPropertyOptional()
  place: string;

  @IsString()
  @ApiPropertyOptional()
  drawImagePath: string;

  @IsBoolean()
  @ApiPropertyOptional()
  daily: boolean;

  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsEnum(commonEnum)
  @ApiPropertyOptional()
  status: boolean;

  // relations
  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty({
    message: transformError('Công ty', ERROR_TYPE.REQUIRED),
  })
  tenantId: number;
  @IsNumber()
  @ApiPropertyOptional()
  userId: number;
}
