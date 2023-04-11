import { Module } from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { EnrollQueuesController } from './enroll-queues.controller';

@Module({
  controllers: [EnrollQueuesController],
  providers: [EnrollQueuesService]
})
export class EnrollQueuesModule {}
