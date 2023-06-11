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
    const query = this.createQueryBuilder('EnrollQueues');
    query
      .delete()
      .from(EnrollQueue)
      .where('status = :status', { status: EnrollQueueEnum.PENDING });
    await query.execute();
  }
}
