import { BaseEntity } from 'src/common/base.entity';
import { QueueEnum } from 'src/common/enum';
import { EnrollQueue } from 'src/enroll-queues/entities/enroll-queue.entity';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Queue class for queue entity object
 */
@Entity('Queues')
export class Queue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  name: string;

  @Column({
    nullable: true,
  })
  note: string;

  @Column({
    nullable: true,
  })
  coord: string;

  @Column({
    unique: true,
  })
  code: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: QueueEnum,
    default: QueueEnum.PENDING,
  })
  status: string;

  @Column({
    nullable: true,
  })
  randomCode: string;

  @Column({
    default: false,
    name: 'is_dynamic',
  })
  isDynamic: boolean;

  @Column({
    nullable: true,
    name: 'is_one_time',
    default: false,
    comment: 'Can change random code when have a success enroll',
  })
  isOneTime: boolean;

  @Column({
    nullable: true,
    name: 'date_get_qrcode',
    type: 'timestamp',
  })
  dateGetQrcode: Date;

  // relations
  @ManyToOne(() => Event, (event) => event.queues)
  @JoinColumn({
    name: 'event_id',
  })
  event: Event;

  @ManyToMany(() => User, (user) => user.queues)
  @JoinTable({
    name: 'RelQueuesUsers',
    joinColumn: {
      name: 'queue_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToMany(() => EnrollQueue, (enrollQueue) => enrollQueue.queue)
  enrollQueues: Promise<EnrollQueue[]>;
}
