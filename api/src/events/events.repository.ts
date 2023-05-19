import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { Queue } from 'src/queues/entities/queue.entity';
import { User } from 'src/users/entities/user.entity';
import { from } from 'rxjs';

/**
 * Events repository class for events table in database
 */
@Injectable()
export class EventsRepository extends Repository<Event> {
  constructor(private readonly dataSource: DataSource) {
    super(Event, dataSource.createEntityManager());
  }

  /**
   * query event user can see
   * @param query   query string
   * @param userId user id
   * @returns event user can see
   */
  async queryEventUserCanSee(
    query: string,
    userId: number,
    page: number,
    size: number,
  ): Promise<[Event[], number]> {
    /*
    SELECT q.event_id , e.*, u.id AS access_id FROM Queues q 
LEFT JOIN Events e ON 
e.id = q.event_id 
LEFT JOIN RelQueuesUsers rqu 
ON rqu.queue_id = q.id 
LEFT JOIN Users u 
ON u.id = rqu.user_id 
    */
    const queryRunner = this.dataSource.createQueryRunner();
    const queryBuilder = queryRunner.manager
      .createQueryBuilder()
      // .distinct(true)
      .select('q.event_id', 'eventId')
      .addSelect('e.*')
      .addSelect('e.draw_image_path', 'drawImagePath')
      .from(Queue, 'q')
      .leftJoin(Event, 'e', 'e.id = q.event_id')
      .leftJoin('RelQueuesUsers', 'rqu', 'rqu.queue_id = q.id')
      .leftJoin(User, 'u', 'u.id = rqu.user_id')
      .where('u.id = :userId', { userId })
      .andWhere('e.status = 1');
    if (query) {
      queryBuilder.andWhere('e.name LIKE :query', { query: `%${query}%` });
    }
    queryBuilder
      .take(size)
      .skip((page - 1) * size)
      .orderBy('e.id', 'DESC');

    // .andWhere('e.name LIKE :query', { query: `%${query}%` });
    const result = (await queryBuilder.getRawMany()) as Event[];
    const number = (await queryBuilder.getCount()) || 0;
    return [result, number];
  }
}
