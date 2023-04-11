import { EnrollQueueEnum } from 'src/common/enum';
import { Queue } from 'src/queues/entities/queue.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('EnrollQueues')
export class EnrollQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'start_serve',
  })
  startServe: Date;

  @Column({
    name: 'end_serve',
  })
  endServe: Date;

  @Column({
    name: 'enroll_time',
  })
  enrollTime: Date;

  @Column({
    type: 'enum',
    enum: EnrollQueueEnum,
    default: EnrollQueueEnum.PENDING,
  })
  status: string;

  @Column({
    nullable: true,
  })
  note: string;

  // relations

  @ManyToOne(() => Queue, (queue) => queue.enrollQueues)
  queue: Promise<Queue>;

  @ManyToOne(() => Session, (session) => session.enrollQueues)
  session: Promise<Session>;
}
