import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { Queue } from './entities/queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { QueuesRepository } from './queues.repository';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), LoggerModule, EventsModule],
  controllers: [QueuesController],
  providers: [QueuesService, QueuesRepository],
})
export class QueuesModule {}
