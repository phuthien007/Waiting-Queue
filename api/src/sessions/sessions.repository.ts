import { DataSource, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Injectable } from '@nestjs/common';
import { EnrollQueue } from 'src/enroll-queues/entities/enroll-queue.entity';

@Injectable()
export class SessionsRepository extends Repository<Session> {
  constructor(private readonly dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  // get all list session not have relation with enroll queue
  async getAllListSessionNotHaveRelationWithEnrollQueue() {
    const query = this.createQueryBuilder('Sessions');
    query.select(['Sessions.id']);
    query.leftJoinAndSelect('Sessions.enrollQueues', 'EnrollQueues');
    query.where('EnrollQueues.id IS NULL');
    return query.getMany();
  }
}
