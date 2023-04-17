import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { EventsRepository } from './events.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), LoggerModule],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  exports: [EventsRepository],
})
export class EventsModule {}
