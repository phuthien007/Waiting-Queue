import { Module, forwardRef } from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { EnrollQueuesController } from './enroll-queues.controller';
import { EnrollQueue } from './entities/enroll-queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { EnrollQueuesRepository } from './enroll-queues.repository';
import { SessionsModule } from 'src/sessions/sessions.module';
import { QueuesModule } from 'src/queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnrollQueue]),
    LoggerModule,
    SessionsModule,
    forwardRef(() => QueuesModule),
  ],
  controllers: [EnrollQueuesController],
  providers: [EnrollQueuesService, EnrollQueuesRepository],
  exports: [EnrollQueuesRepository],
})
export class EnrollQueuesModule {}
