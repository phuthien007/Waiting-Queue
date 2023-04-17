import { PartialType } from '@nestjs/swagger';
import { CreateQueueDto } from './create-queue.dto';

/**
 * UpdateQueueDto class for update queue DTO object from request body
 */
export class UpdateQueueDto extends PartialType(CreateQueueDto) {}
