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

export class CreateEventDto extends BaseDto {
  @IsString({
    message: transformError('Tên sự kiện', ERROR_TYPE.REQUIRED),
  })
  @IsNotEmpty()
  name: string;

  @IsDateString()
  from: Date;

  @IsDateString()
  to: Date;

  @IsString()
  note: string;

  @IsString()
  place: string;

  @IsString()
  drawImagePath: string;

  @IsBoolean()
  daily: boolean;

  @IsString()
  description: string;

  @IsEnum(commonEnum)
  status: boolean;

  // relations
  @IsNumber()
  tenantId: number;
  @IsNumber()
  userId: number;
}
