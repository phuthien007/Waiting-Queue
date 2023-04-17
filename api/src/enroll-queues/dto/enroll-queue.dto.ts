import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { EnrollQueueEnum } from 'src/common/enum';
import { Queue } from 'src/queues/entities/queue.entity';
import { Session } from 'src/sessions/entities/session.entity';

export class EnrollQueueDto {
  @ApiPropertyOptional()
  @Expose()
  startServe: Date;

  @ApiPropertyOptional()
  @Expose()
  endServe: Date;

  @ApiPropertyOptional()
  @Expose()
  enrollTime: Date;

  @ApiPropertyOptional()
  @Expose()
  status: string;

  @ApiPropertyOptional()
  @Expose()
  note: string;

  // relations

  @Expose()
  @ApiPropertyOptional()
  queue: Queue;

  @Expose()
  @ApiPropertyOptional()
  session: Session;
}
