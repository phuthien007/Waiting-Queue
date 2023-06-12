import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EnrollQueue } from './entities/enroll-queue.entity';
import { EnrollQueueEnum } from 'src/common/enum';

@Injectable()
export class EnrollQueuesRepository extends Repository<EnrollQueue> {
  constructor(private readonly dataSource: DataSource) {
    super(EnrollQueue, dataSource.createEntityManager());
  }

  async deleteAllPendingEnrollQueues() {
    console.log(' start deleteAllPendingEnrollQueues');
    const query = this.createQueryBuilder('EnrollQueues');
    query
      .delete()
      .where('EnrollQueues.status = :status', {
        status: EnrollQueueEnum.PENDING,
      })
      .orWhere('EnrollQueues.status = :status', {
        status: EnrollQueueEnum.SERVING,
      });

    // delete all enroll queue with status pending and serving
    await query.execute();
    console.log(' end deleteAllPendingEnrollQueues');
  }
}
