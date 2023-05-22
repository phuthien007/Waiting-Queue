/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollQueuesRepository } from 'src/enroll-queues/enroll-queues.repository';
import { LoggerService } from 'src/logger/logger.service';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionsRepository } from 'src/sessions/sessions.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TaskSchedulesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly enrollQueuesRepository: EnrollQueuesRepository,
    private readonly sessionRepository: SessionsRepository,
  ) {}

  @Cron('0 0 0 * * *')
  handleCron() {
    this.logger.log('Run task every day at 12:00:00 AM');
    this.logger.log('Clear all data pending in database');
    try {
      this.logger.log('Start clear');
      this.enrollQueuesRepository.deleteAllPendingEnrollQueues();
      this.sessionRepository.deleteAllSessions();
      this.logger.log('End clear');
    } catch (err) {
      this.logger.error('Error clear \n', err);
    }
  }
}
