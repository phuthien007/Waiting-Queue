import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { EventDto } from 'src/events/dto/event.dto';

/**
 * QueueDto class for queue DTO object from request body and response body
 */
export class QueueDto {
  @ApiPropertyOptional()
  id: number;

  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  createdAt: Date;
  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  updatedAt: Date;
  @ApiPropertyOptional()
  @Expose()
  name: string;
  @ApiPropertyOptional()
  @Expose()
  note: string;
  @ApiPropertyOptional()
  @Expose()
  coord: string;
  @ApiPropertyOptional()
  @Expose()
  code: string;
  @ApiPropertyOptional()
  @Expose()
  description: string;
  @ApiPropertyOptional()
  @Expose()
  status: string;

  @ApiPropertyOptional()
  @Expose()
  isDynamic: boolean;
  @ApiPropertyOptional({
    default: false,
  })
  @Expose()
  isOneTime: boolean;

  @ApiPropertyOptional()
  @Expose()
  dateGetQrcode: Date;
  // relations
  @ApiPropertyOptional()
  @Expose()
  @Transform(({ obj }) => {
    // transform event to EventDto
    if (obj.event) {
      return {
        id: obj.event.id,
        name: obj.event.name,
      };
    }
    return null;
  })
  event: EventDto;
}
