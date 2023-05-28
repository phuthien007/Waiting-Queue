import { DataSource, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Injectable } from '@nestjs/common';
import { EnrollQueue } from 'src/enroll-queues/entities/enroll-queue.entity';

@Injectable()
export class SessionsRepository extends Repository<Session> {
  constructor(private readonly dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  async deleteAllSessions() {
    const query = this.createQueryBuilder('session');
    const result = query
      .leftJoin(
        EnrollQueue,
        'enrollQueue',
        'enrollQueue.sessionId = session.id',
      )
      .andWhere('enrollQueue.status != :status', { status: 'done' })
      .where('enrollQueue.status != :status', { status: 'done' });

    result.getMany().then((res) => {
      query
        .delete()
        .from(Session)
        .where('id IN (:...ids)', { ids: res.map((r) => r.id) });
    });

    await query.execute();
  }
}
