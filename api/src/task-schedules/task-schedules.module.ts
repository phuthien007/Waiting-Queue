import { Module } from '@nestjs/common';
import { TaskSchedulesService } from './task-schedules.service';
import { LoggerModule } from 'src/logger/logger.module';
import { EnrollQueuesModule } from 'src/enroll-queues/enroll-queues.module';

@Module({
  imports: [LoggerModule, EnrollQueuesModule],
  providers: [TaskSchedulesService],
})
export class TaskSchedulesModule {}
