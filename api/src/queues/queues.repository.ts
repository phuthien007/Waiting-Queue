import { DataSource, Equal, In, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Queue } from './entities/queue.entity';
import { User } from 'src/users/entities/user.entity';
import { QueueDto } from './dto/queue.dto';
import { QueueEnum } from 'src/common/enum';

/**
 * QueuesRepository class for queue repository
 */
@Injectable()
export class QueuesRepository extends Repository<Queue> {
  constructor(private readonly dataSource: DataSource) {
    super(Queue, dataSource.createEntityManager());
  }

  /**
   * assign list member into queue
   * @param queueId queue id
   * @param memberIds list of member id
   */
  async assignMemberIntoQueue(queueId: number, memberIds: number[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Tạo một subquery để lấy các user object dựa trên userIds
      const users = await queryRunner.manager
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.id IN (:...memberIds)', { memberIds })
        .getMany();

      // Lấy hàng đợi dựa trên queueId
      const queue = await queryRunner.manager.findOne(Queue, {
        where: { id: queueId, status: Not(Equal(QueueEnum.IS_CLOSED)) },
      });

      // Thêm các user vào hàng đợi thông qua mối quan hệ many-to-many
      queue.users = [...users];

      // Lưu thay đổi vào database
      await queryRunner.manager.save(queue);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *
   * @param query text query name
   * @param userId query user id
   * @param eventId query event id
   * @returns queue user can see
   */
  async queueUserCanSee(
    query: string,
    userId: number,
    eventId: string,
    page: number,
    size: number,
  ): Promise<[Queue[], number]> {
    const queryRunner = this.dataSource.createQueryRunner();
    const queryBuilder = queryRunner.manager
      .createQueryBuilder()
      .select('q.*')
      // .addSelect('e.*')
      .from(Queue, 'q')
      .leftJoin('Events', 'e', 'e.id = q.event_id')
      .leftJoin('RelQueuesUsers', 'rqu', 'rqu.queue_id = q.id')
      .leftJoin(User, 'u', 'u.id = rqu.user_id')
      .where('u.id in (:userId)', { userId })
      // .andWhere('e.status = :status', { status: 1 })
      .andWhere('q.status != :status', { status: QueueEnum.IS_CLOSED });

    if (eventId) {
      queryBuilder
        .andWhere('q.event_id = :eventId', { eventId })
        .andWhere('e.status = 1');
    }
    if (query) {
      queryBuilder.andWhere('q.name LIKE :query', { query: `%${query}%` });
    }

    queryBuilder.take(size).skip((page - 1) * size);

    // .andWhere('e.name LIKE :query', { query: `%${query}%` });
    const result = (await queryBuilder.getRawMany()) as Queue[];
    const total = await queryBuilder.getCount();
    return [result, total];
  }
}
