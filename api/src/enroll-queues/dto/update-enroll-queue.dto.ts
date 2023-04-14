import { PartialType } from '@nestjs/swagger';
import { CreateEnrollQueueDto } from './create-enroll-queue.dto';

export class UpdateEnrollQueueDto extends PartialType(CreateEnrollQueueDto) {}
