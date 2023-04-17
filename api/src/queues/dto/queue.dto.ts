import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { EventDto } from 'src/events/dto/event.dto';

/**
 * QueueDto class for queue DTO object from request body and response body
 */
export class QueueDto extends BaseDto {
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
