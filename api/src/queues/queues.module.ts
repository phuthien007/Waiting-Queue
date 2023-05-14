import { Module, forwardRef } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { Queue } from './entities/queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { QueuesRepository } from './queues.repository';
import { EventsModule } from 'src/events/events.module';
import { EnrollQueuesModule } from 'src/enroll-queues/enroll-queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue]),
    LoggerModule,
    forwardRef(() => EventsModule),
    forwardRef(() => EnrollQueuesModule),
  ],
  controllers: [QueuesController],
  providers: [QueuesService, QueuesRepository],
  exports: [QueuesRepository, QueuesService],
})
export class QueuesModule {}
