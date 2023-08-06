/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollQueuesRepository } from 'src/enroll-queues/enroll-queues.repository';
import { EventsRepository } from 'src/events/events.repository';
import { LoggerService } from 'src/logger/logger.service';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionsRepository } from 'src/sessions/sessions.repository';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class TaskSchedulesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly enrollQueuesRepository: EnrollQueuesRepository,
    private readonly sessionRepository: SessionsRepository,
    private readonly eventRepository: EventsRepository,
  ) {}

  @Cron('0 0 0 * * *')
  async handleCron() {
    this.logger.log('Run task every day at 00:00:00 AM' + new Date());
    this.logger.log('Clear all data pending in database');
    try {
      this.logger.log('Start clear');
      const listEnrollQueue = await this.enrollQueuesRepository
        .find
        //   {
        //   where: [{ status: 'PENDING' }, { status: 'SERVING' }],
        // }
        ();
      if (listEnrollQueue && listEnrollQueue.length > 0) {
        await this.enrollQueuesRepository.delete(
          listEnrollQueue.map((item) => item.id),
        );
      }

      // get all list session not have relation with enroll queue
      const listSession =
        await this.sessionRepository.getAllListSessionNotHaveRelationWithEnrollQueue();
      if (listSession && listSession.length > 0) {
        await this.sessionRepository.delete(listSession.map((item) => item.id));
      }
      this.logger.log('End clear');
    } catch (err) {
      this.logger.error('Error clear \n', err);
    }
  }

  @Cron('0 * * * * *')
  async handleTriggerEvent() {
    // get all event
    // if have end time < now => update status event to false
    const eventList = await this.eventRepository.find({
      where: {
        status: true,
        from: Not(IsNull()),
        to: Not(IsNull()),
      },
    });

    if (eventList && eventList.length > 0) {
      eventList.forEach(async (event) => {
        if (event.to < new Date()) {
          try {
            // @ts-ignore
            await this.eventRepository.update(event.id, { status: 0 });
          } catch (err) {
            this.logger.error('Error update status event \n', err);
          }
        }
      });
    }
  }
}
