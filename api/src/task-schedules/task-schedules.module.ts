import { Module } from '@nestjs/common';
import { TaskSchedulesService } from './task-schedules.service';
import { LoggerModule } from 'src/logger/logger.module';
import { EnrollQueuesModule } from 'src/enroll-queues/enroll-queues.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [LoggerModule, EnrollQueuesModule, SessionsModule, EventsModule],
  providers: [TaskSchedulesService],
})
export class TaskSchedulesModule {}
