import { BaseDto } from 'src/common/base.dto';
import { EventDto } from 'src/events/dto/event.dto';

export class QueueDto extends BaseDto {
  name: string;
  note: string;
  coord: string;
  code: string;
  description: string;
  status: string;
  // relations
  event: EventDto;
}
