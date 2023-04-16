import { Module } from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { EnrollQueuesController } from './enroll-queues.controller';
import { EnrollQueue } from './entities/enroll-queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { EnrollQueuesRepository } from './enroll-queues.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnrollQueue]), LoggerModule],
  controllers: [EnrollQueuesController],
  providers: [EnrollQueuesService, EnrollQueuesRepository],
})
export class EnrollQueuesModule {}
