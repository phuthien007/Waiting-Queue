import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Queue } from './entities/queue.entity';
import { User } from 'src/users/entities/user.entity';

/**
 * QueuesRepository class for queue repository
 */
@Injectable()
export class QueuesRepository extends Repository<Queue> {
  constructor(private readonly dataSource: DataSource) {
    super(Queue, dataSource.createEntityManager());
  }

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
        where: { id: queueId },
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
}
