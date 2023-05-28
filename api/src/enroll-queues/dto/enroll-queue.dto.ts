import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { EnrollQueueEnum } from 'src/common/enum';
import { QueueDto } from 'src/queues/dto/queue.dto';
import { Queue } from 'src/queues/entities/queue.entity';
import { Session } from 'src/sessions/entities/session.entity';

export class EnrollQueueDto {
  @ApiPropertyOptional()
  @Expose()
  currentQueue: number;

  @ApiPropertyOptional()
  @Expose()
  id: string;

  @ApiPropertyOptional()
  @Expose()
  willEnrollWhen: Date;

  @ApiPropertyOptional()
  @Expose()
  serveTimeAvg: number;

  @ApiPropertyOptional()
  @Expose()
  sequenceNumber: number;

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
  @Transform(({ obj }) => {
    if (obj.queue) {
      return {
        id: obj.queue.id,
        code: obj.queue.code,
        name: obj.queue.name,
        description: obj.queue.description,
        event: obj.queue.event,
        status: obj.queue.status,
      };
    }
    return null;
  })
  queue: QueueDto;

  @Exclude()
  @ApiPropertyOptional()
  session: Session;
}
