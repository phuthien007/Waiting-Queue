import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EnrollQueue } from './entities/enroll-queue.entity';

@Injectable()
export class EnrollQueuesRepository extends Repository<EnrollQueue> {
  constructor(private readonly dataSource: DataSource) {
    super(EnrollQueue, dataSource.createEntityManager());
  }

  async deleteAllPendingEnrollQueues() {
    const query = this.createQueryBuilder('enrollQueue');
    query.delete().where('enrollQueue.status = :status', { status: 'pending' });
    await query.execute();
  }
}
