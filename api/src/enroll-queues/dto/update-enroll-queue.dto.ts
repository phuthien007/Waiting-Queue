import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollQueueDto } from './create-enroll-queue.dto';

export class UpdateEnrollQueueDto extends PartialType(CreateEnrollQueueDto) {}
