import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { EnrollQueueEnum } from 'src/common/enum';

export class CreateEnrollQueueDto {
  @IsDateString()
  startServe: Date;

  @IsDateString()
  endServe: Date;

  @IsDateString()
  enrollTime: Date;

  @IsEnum(EnrollQueueEnum)
  status: string;

  @IsString()
  note: string;

  // relations

  @IsNumber()
  queueId: number;

  @IsNumber()
  sessionId: number;
}
