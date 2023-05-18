/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EnrollQueuesRepository } from 'src/enroll-queues/enroll-queues.repository';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class TaskSchedulesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly enrollQueuesRepository: EnrollQueuesRepository,
  ) {}

  @Cron('0 0 0 * * *')
  handleCron() {
    this.logger.log('Run task every day at 12:00:00 AM');
    this.logger.log('Clear all data pending in database');
    try {
      this.logger.log('Start clear');
      this.enrollQueuesRepository.delete({
        status: 'pending',
      });
      this.logger.log('End clear');
    } catch (err) {
      this.logger.error('Error clear \n', err);
    }
  }
}
