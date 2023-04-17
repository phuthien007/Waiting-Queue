import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

/**
 * Update event DTO class for update event request body
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {}
