import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsDateString()
  startServe: Date;

  @ApiPropertyOptional()
  @IsDateString()
  endServe: Date;

  @ApiPropertyOptional()
  @IsDateString()
  enrollTime: Date;

  @ApiPropertyOptional()
  @IsEnum(EnrollQueueEnum)
  status: string;

  @ApiPropertyOptional()
  @IsString()
  note: string;

  // relations

  @ApiPropertyOptional()
  @IsNumber()
  queueId: number;

  @ApiPropertyOptional()
  @IsNumber()
  sessionId: number;
}
