import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { EnrollQueueEnum } from 'src/common/enum';

export class CreateEnrollQueueDto {
  @ApiPropertyOptional()
  @IsString()
  note: string;

  // relations

  @ApiProperty()
  @IsString()
  queueCode: string;
}
