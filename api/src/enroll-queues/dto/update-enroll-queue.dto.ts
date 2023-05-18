import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnrollQueueDto } from './create-enroll-queue.dto';
import { EnrollQueueEnum } from 'src/common/enum';

export class UpdateEnrollQueueDto extends PartialType(CreateEnrollQueueDto) {
  @ApiProperty({ enum: EnrollQueueEnum })
  status: string;
}
